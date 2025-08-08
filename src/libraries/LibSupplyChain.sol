// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Role} from "@chronicle-types/PartyStorage.sol";
import {ProductStatus} from "@chronicle-types/ProductStorage.sol";
import {LibParty} from "@chronicle/libraries/LibParty.sol";
import {LibProduct} from "@chronicle/libraries/LibProduct.sol";
import {
    SupplyChainStatus, SupplyChainStorage, SUPPLYCHAIN_STORAGE_SLOT
} from "@chronicle-types/SupplyChainStorage.sol";
import {LibContext} from "@chronicle/libraries/LibContext.sol";
import {LibSafeHTS} from "@chronicle/libraries/hts/safe-hts/LibSafeHTS.sol";
import {LibSafeViewHTS} from "@chronicle/libraries/hts/safe-hts/LibSafeViewHTS.sol";
import {IHederaTokenService} from "hedera-token-service/IHederaTokenService.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
/// forge-lint: disable-next-line(unaliased-plain-import)
import "@chronicle-logs/ProductLogs.sol";
/// forge-lint: disable-next-line(unaliased-plain-import)
import "@chronicle/libraries/errors/SupplyChainErrors.sol";

library LibSupplyChain {
    using LibParty for address;
    using LibProduct for address;
    using LibSafeHTS for address;
    using LibSafeViewHTS for address;
    using Address for address payable;
    using EnumerableSet for EnumerableSet.AddressSet;

    function _supplyChainStorage() internal pure returns (SupplyChainStorage storage scs_) {
        assembly {
            scs_.slot := SUPPLYCHAIN_STORAGE_SLOT
        }
    }

    function _retailerOrderProduct(address _productToken, int64 _quantity) internal {
        address retailer = LibContext._msgSender();
        if (!retailer._hasActiveRole(Role.Retailer)) revert NotRetailer(retailer);
        if (_productToken._getProductByTokenAddress().status != ProductStatus.ForSale) {
            revert ProductNotAvailable(_productToken);
        }

        (,,, uint256 totalFee) = _calculateFees(_productToken, _quantity);
        payable(address(this)).sendValue(totalFee);

        _productToken.safeAssociateToken(retailer);
        _productToken.safeApprove(retailer, uint256(int256(_quantity)));

        SupplyChainStorage storage $ = _supplyChainStorage();
        $.allOrderedProducts.add(_productToken);
        $.retailerToProducts[retailer].add(_productToken);
        $.productToRetailers[_productToken].add(retailer);
        LibProduct._productStorage().tokenToProduct[_productToken].status = ProductStatus.Ordered;

        emit ProductOrdered(retailer, _productToken, _quantity);
    }

    function _transporterSelectOrder(address _productToken, int64 _quantity) internal {
        address transporter = LibContext._msgSender();
        if (!transporter._hasActiveRole(Role.Transporter)) revert NotTransporter(transporter);

        Product memory product = _productToken._getProductByTokenAddress();
        if (product.status != ProductStatus.Ordered) {
            revert ProductNotOrdered(_productToken);
        }

        _takeCollateralFromTransporter(_productToken, _quantity);

        SupplyChainStorage storage $ = _supplyChainStorage();
        $.transporterToProducts[transporter].add(_productToken);
        $.productToTransporter[_productToken] = transporter;
        $.transporterToProductSupplyChainStatus[transporter][_productToken] = SupplyChainStatus.Assigned;
        LibProduct._productStorage().tokenToProduct[_productToken].status = ProductStatus.Assigned;

        emit ProductFulfilled(transporter, _productToken, _quantity);
    }

    function _transporterUpdateStatus(address _productToken, SupplyChainStatus _status) internal {
        address transporter = LibContext._msgSender();
        if (!transporter._hasActiveRole(Role.Transporter)) revert NotTransporter(transporter);
        if (_productToken._getProductByTokenAddress().status != ProductStatus.Assigned) {
            revert ProductNotAssigned(_productToken);
        }

        SupplyChainStorage storage $ = _supplyChainStorage();
        $.productSupplyStatus[_productToken] = _status;
        $.transporterToProductSupplyChainStatus[transporter][_productToken] = _status;

        emit ProductStatusUpdated(transporter, _productToken, _status);
    }

    function _retailerReceiveProduct(address _productToken, int64 _quantity) internal {
        address retailer = LibContext._msgSender();
        if (!retailer._hasActiveRole(Role.Retailer)) revert NotRetailer(retailer);

        Product memory product = _productToken._getProductByTokenAddress();
        if (product.status != ProductStatus.ForSale) revert ProductNotAvailable(_productToken);

        _productToken.safeTransferFromToken(address(this), retailer, _quantity);

        SupplyChainStorage storage $ = _supplyChainStorage();
        $.retailerToProducts[retailer].add(_productToken);
        $.productToRetailers[_productToken].add(retailer);

        _paySupplier(_productToken, product.supplier, _quantity);
        _payTransporter(_productToken, $.productToTransporter[_productToken], _quantity);

        emit ProductBought(retailer, _productToken, _quantity);
    }

    function _calculateFees(address _productToken, int64 _quantity)
        private
        returns (uint256 platformFee_, uint256 supplierPay_, uint256 transporterPay_, uint256 totalFee_)
    {
        (IHederaTokenService.FixedFee[] memory fixedFees, IHederaTokenService.FractionalFee[] memory fractionalFees,) =
            _productToken.safeGetTokenCustomFees();
        int64 platformUnitFee = (fixedFees[0].amount * fractionalFees[0].numerator) / fractionalFees[0].denominator;
        platformFee_ = uint256(int256(platformUnitFee * _quantity));
        int64 supplierUnitPay = fixedFees[0].amount - platformUnitFee;
        supplierPay_ = uint256(int256(supplierUnitPay * _quantity));
        int64 transporterUnitPay = fixedFees[1].amount;
        transporterPay_ = uint256(int256(transporterUnitPay * _quantity));
        totalFee_ = platformFee_ + supplierPay_ + transporterPay_;
    }

    function _paySupplier(address _productToken, address _supplier, int64 _quantity) private {
        (uint256 supplierPay,,,) = _calculateFees(_productToken, _quantity);
        payable(_supplier).sendValue(supplierPay);
    }

    function _takeCollateralFromTransporter(address _productToken, int64 _quantity) private {
        (,, uint256 transporterPay,) = _calculateFees(_productToken, _quantity);
        payable(address(this)).sendValue(transporterPay);
    }

    function _payTransporter(address _productToken, address _transporter, int64 _quantity) private {
        (,, uint256 transporterPay,) = _calculateFees(_productToken, _quantity);
        payable(_transporter).sendValue(transporterPay * 2);
    }

    function _refundRetailer(address _productToken, address _retailer, int64 _quantity) private {
        (uint256 platformFee,,, uint256 totalFee) = _calculateFees(_productToken, _quantity);
        payable(_retailer).sendValue(totalFee - platformFee);
    }

    // TODO: implement dutch auction
    // function _getTransportFee(address _productToken) internal view returns (uint256) {
    //     Product memory product = _productToken._getProductByTokenAddress();
    //     uint256 timeElapsed = block.timestamp - product.updated;
    //     return uint256(int256(product.transportFee)) - (DISCOUNT_RATE * timeElapsed);
    // }

    function _getAllActiveDeliveriesAddress() internal view returns (address[] memory) {
        return _supplyChainStorage().activeProductDeliveries.values();
    }

    function _getAllActiveDeliveries() internal view returns (Product[] memory products_) {
        address[] memory addresses = _getAllActiveDeliveriesAddress();
        uint256 addressesLength = addresses.length;
        products_ = new Product[](addressesLength);
        for (uint256 i; i < addressesLength; ++i) {
            products_[i] = LibProduct._getProductByTokenAddress(addresses[i]);
        }
    }

    function _getProductSupplyChainStatus(address _productToken) internal view returns (SupplyChainStatus) {
        return _supplyChainStorage().productSupplyStatus[_productToken];
    }

    function _getRetailerOrders(address _retailer) internal view returns (address[] memory) {
        return _supplyChainStorage().retailerToProducts[_retailer].values();
    }

    function _getTransporterOrders(address _transporter) internal view returns (address[] memory) {
        return _supplyChainStorage().transporterToProducts[_transporter].values();
    }

    function _getSupplierOrders(address _supplier) internal view returns (address[] memory) {
        return _supplyChainStorage().supplierToProducts[_supplier].values();
    }

    function _getProductRetailers(address _productToken) internal view returns (address[] memory) {
        return _supplyChainStorage().productToRetailers[_productToken].values();
    }

    function _getProductTransporter(address _productToken) internal view returns (address) {
        return _supplyChainStorage().productToTransporter[_productToken];
    }

    function _getProductSuppliers(address _productToken) internal view returns (address[] memory) {
        return _supplyChainStorage().productToSuppliers[_productToken].values();
    }
}
