// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IHederaTokenService} from "hedera-token-service/IHederaTokenService.sol";
import {LibSafeHTS} from "@chronicle/libraries/hts/safe-hts/LibSafeHTS.sol";
import {LibContext} from "@chronicle/libraries/LibContext.sol";
import {Role} from "@chronicle-types/PartyStorage.sol";
import {KeyType, KeyValueType} from "@chronicle-types/KeyHelperStorage.sol";
import {ProductStatus, Product, ProductStorage, PRODUCT_STORAGE_SLOT} from "@chronicle-types/ProductStorage.sol";
import {LibParty} from "@chronicle/libraries/LibParty.sol";
import {LibKeyHelper} from "@chronicle/libraries/hts/LibKeyHelper.sol";
import {LibFeeHelper} from "@chronicle/libraries/hts/LibFeeHelper.sol";
/// forge-lint: disable-next-line(unaliased-plain-import)
import "@chronicle-logs/ProductLogs.sol";
/// forge-lint: disable-next-line(unaliased-plain-import)
import "@chronicle/libraries/errors/ProductErrors.sol";
/// forge-lint: disable-next-line(unaliased-plain-import)
import "@chronicle/libraries/errors/PartyErrors.sol";
/// forge-lint: disable-next-line(unaliased-plain-import)
import "@chronicle/libraries/errors/SupplyChainErrors.sol";

library LibProduct {
    using LibParty for address;
    using LibKeyHelper for KeyType;
    using LibFeeHelper for int64;
    using LibSafeHTS for address;
    using LibSafeHTS for IHederaTokenService.HederaToken;
    using EnumerableSet for EnumerableSet.AddressSet;

    //*//////////////////////////////////////////////////////////////////////////
    //                                  STORAGE
    //////////////////////////////////////////////////////////////////////////*//
    function _productStorage() internal pure returns (ProductStorage storage pds_) {
        assembly {
            pds_.slot := PRODUCT_STORAGE_SLOT
        }
    }

    //*//////////////////////////////////////////////////////////////////////////
    //                             INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*//
    function _addProduct(
        string calldata _name,
        string calldata _memo,
        int64 _price,
        int64 _transporterFee,
        int64 _initialSupply
    ) internal {
        address supplier = LibContext._msgSender();
        if (!supplier._hasActiveRole(Role.Supplier)) revert NotSupplier(supplier);

        address productToken = _createProductToken(_name, _memo, _price, _transporterFee, _initialSupply);
        if (productToken == address(0)) revert InvalidTokenAddress();

        productToken.safeAssociateToken(supplier);

        int64 newTotalSupply = _mintProductToken(productToken, _initialSupply);

        ProductStorage storage $ = _productStorage();
        $.activeProducts.add(productToken);
        Product memory product = Product({
            id: uint32($.activeProducts.length()),
            tokenAddress: productToken,
            name: _name,
            memo: _memo,
            price: _price,
            transportFee: _transporterFee,
            totalSupply: newTotalSupply,
            supplier: supplier,
            status: ProductStatus.ForSale,
            created: uint40(block.timestamp),
            updated: uint40(block.timestamp)
        });
        $.tokenToProduct[productToken] = product;
        $.supplierToProducts[supplier].add(productToken);

        emit ProductCreated(product);
    }

    function _updateProduct(
        address _productToken,
        string calldata _name,
        string calldata _memo,
        int64 _price,
        int64 _transporterFee
    ) internal {
        if (_productToken == address(0)) revert InvalidTokenAddress();

        ProductStorage storage $ = _productStorage();
        if (!$.activeProducts.contains(_productToken)) revert ProductInactive(_productToken);
        if ($.tokenToProduct[_productToken].supplier != LibContext._msgSender()) {
            revert NotSupplier($.tokenToProduct[_productToken].supplier);
        }
        if ($.tokenToProduct[_productToken].status != ProductStatus.ForSale) revert ProductSold(_productToken);

        _productToken.safeUpdateTokenInfo(_getProductToken(_name, _memo));
        _productToken.safeUpdateTokenKeys(_getProductTokenKeys());
        _updateProductToken(_productToken, _price, _transporterFee);

        Product memory product = $.tokenToProduct[_productToken];
        product.name = _name;
        product.memo = _memo;
        product.price = _price;
        product.transportFee = _transporterFee;
        product.updated = uint40(block.timestamp);
        $.tokenToProduct[_productToken] = product;

        emit ProductUpdated(product);
    }

    function _increaseProductQuantity(address _productToken, int64 _quantity) internal {
        if (_productToken == address(0)) revert InvalidTokenAddress();

        ProductStorage storage $ = _productStorage();
        if (!$.activeProducts.contains(_productToken)) revert ProductInactive(_productToken);
        if ($.tokenToProduct[_productToken].supplier != LibContext._msgSender()) {
            revert NotSupplier($.tokenToProduct[_productToken].supplier);
        }
        if ($.tokenToProduct[_productToken].status != ProductStatus.ForSale) revert ProductSold(_productToken);

        int64 newTotalSupply = _mintProductToken(_productToken, _quantity);

        Product memory product = $.tokenToProduct[_productToken];
        product.totalSupply = newTotalSupply;
        $.tokenToProduct[_productToken] = product;

        emit ProductQuantityIncreased(product);
    }

    function _decreaseProductQuantity(address _productToken, int64 _quantity) internal {
        if (_productToken == address(0)) revert InvalidTokenAddress();

        ProductStorage storage $ = _productStorage();
        if (!$.activeProducts.contains(_productToken)) revert ProductInactive(_productToken);
        if ($.tokenToProduct[_productToken].supplier != LibContext._msgSender()) {
            revert NotSupplier($.tokenToProduct[_productToken].supplier);
        }
        if ($.tokenToProduct[_productToken].status != ProductStatus.ForSale) revert ProductSold(_productToken);

        int64[] memory serialNumbers;
        int64 newTotalSupply = _productToken.safeBurnToken(_quantity, serialNumbers);

        Product memory product = $.tokenToProduct[_productToken];
        product.totalSupply = newTotalSupply;
        $.tokenToProduct[_productToken] = product;

        emit ProductQuantityDecreased(product);
    }

    //*//////////////////////////////////////////////////////////////////////////
    //                               VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*//
    function _getProductByTokenAddress(address _productToken) internal view returns (Product memory) {
        return _productStorage().tokenToProduct[_productToken];
    }

    function _getAllProductsTokenAddress() internal view returns (address[] memory) {
        return _productStorage().activeProducts.values();
    }

    function _getAllProducts() internal view returns (Product[] memory products_) {
        address[] memory tokenAddresses = _getAllProductsTokenAddress();
        products_ = new Product[](tokenAddresses.length);
        for (uint256 i; i < tokenAddresses.length; ++i) {
            products_[i] = _getProductByTokenAddress(tokenAddresses[i]);
        }
    }

    function _getProductsCount() internal view returns (uint256) {
        return _productStorage().activeProducts.length();
    }

    // TODO: implement
    // function _getProductsByPage(uint8 _page, uint8 _pageSize) internal view returns (Product[] memory products_) {
    //     uint256 numOfProducts = _getNumberOfProducts();
    //     if (_pageSize > numOfProducts) return _getAllProducts();
    //     uint8 remNumOfProducts = uint8(numOfProducts % _pageSize);
    //     uint8 rngNumOfProducts = uint8(numOfProducts - remNumOfProducts);
    //     uint8 pages = rngNumOfProducts / _pageSize;
    //     // products_ = (_page > pages) ?  ;

    //     // uint256 startIndex = (_page - 1) * _pageSize;
    //     // uint256 endIndex = _page * _pageSize;
    //     // if (endIndex > numberOfProducts) endIndex = numberOfProducts;
    //     // products_ = new Product[](endIndex - startIndex);
    //     // for (uint256 i; i < endIndex - startIndex; ++i) {
    //     //     products_[i] = _getProductByTokenAddress(_productStorage().activeProducts.at(startIndex + i));
    //     // }
    // }

    function _getProductsByRange(uint8 _start, uint8 _end) internal view returns (Product[] memory products_) {
        products_ = new Product[](_end - _start);
        for (_start; _start < _end; ++_start) {
            products_[_start] = _getProductByTokenAddress(_productStorage().activeProducts.at(_start));
        }
    }

    function _getSupplierProductTokenAddresses(address _supplier) internal view returns (address[] memory) {
        return _productStorage().supplierToProducts[_supplier].values();
    }

    function _getSupplierProducts(address _supplier) internal view returns (Product[] memory products_) {
        address[] memory tokenAddresses = _getSupplierProductTokenAddresses(_supplier);
        products_ = new Product[](tokenAddresses.length);
        for (uint256 i; i < tokenAddresses.length; ++i) {
            products_[i] = _getProductByTokenAddress(tokenAddresses[i]);
        }
    }

    //*//////////////////////////////////////////////////////////////////////////
    //                             PRIVATE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*//
    function _createProductToken(
        string calldata _name,
        string calldata _memo,
        int64 _price,
        int64 _transporterFee,
        int64 _initialSupply
    ) private returns (address) {
        (IHederaTokenService.FixedFee[] memory fixedFees, IHederaTokenService.FractionalFee[] memory fractionalFee) =
            _getProductFees(_price, _transporterFee);
        address productToken = _getProductToken(_name, _memo).safeCreateFungibleTokenWithCustomFees(
            _initialSupply, 0, fixedFees, fractionalFee
        );
        return productToken;
    }

    function _mintProductToken(address _productToken, int64 _initialSupply) private returns (int64) {
        bytes[] memory metadata;
        (int64 newTotalSupply,) = _productToken.safeMintToken(_initialSupply, metadata);
        return newTotalSupply;
    }

    function _updateProductToken(address _productToken, int64 _price, int64 _transporterFee) private {
        (IHederaTokenService.FixedFee[] memory fixedFees, IHederaTokenService.FractionalFee[] memory fractionalFees) =
            _getProductFees(_price, _transporterFee);

        _productToken.safeUpdateFungibleTokenCustomFees(fixedFees, fractionalFees);
    }

    function _getProductFees(int64 _price, int64 _transporterFee)
        private
        view
        returns (
            IHederaTokenService.FixedFee[] memory fixedFees_,
            IHederaTokenService.FractionalFee[] memory fractionalFee_
        )
    {
        fixedFees_ = new IHederaTokenService.FixedFee[](2);
        // supplier fee
        fixedFees_[0] = _price.createFixedFeeForHbars(LibContext._msgSender());
        // transporter fee
        fixedFees_[1] = _transporterFee.createFixedFeeForHbars(LibContext._msgSender());
        // 1% platform fee
        fractionalFee_ = LibFeeHelper.createSingleFractionalFee(100, 10000, false, address(this));
    }

    function _getProductToken(string calldata _name, string calldata _memo)
        private
        view
        returns (IHederaTokenService.HederaToken memory token_)
    {
        token_.name = _name;
        token_.symbol = "CSP";
        token_.memo = _memo;
        token_.treasury = address(this);
        token_.tokenKeys = _getProductTokenKeys();
    }

    function _getProductTokenKeys() private view returns (IHederaTokenService.TokenKey[] memory tokenKeys_) {
        tokenKeys_ = new IHederaTokenService.TokenKey[](7);
        tokenKeys_[0] = KeyType.ADMIN.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[1] = KeyType.KYC.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[2] = KeyType.FREEZE.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[3] = KeyType.WIPE.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[4] = KeyType.SUPPLY.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[5] = KeyType.FEE.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[6] = KeyType.PAUSE.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
    }
}
