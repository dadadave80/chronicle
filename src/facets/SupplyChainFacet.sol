// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {LibSupplyChain} from "@chronicle/libraries/LibSupplyChain.sol";
import {SupplyChainStatus} from "@chronicle-types/SupplyChainStorage.sol";
import {Product} from "@chronicle-types/ProductStorage.sol";

contract SupplyChainFacet {
    using LibSupplyChain for address;

    function retailerOrderProduct(address _productToken, int64 _quantity) external payable {
        _productToken._retailerOrderProduct(_quantity);
    }

    function transporterSelectOrder(address _productToken, int64 _quantity) external payable {
        _productToken._transporterSelectOrder(_quantity);
    }

    function transporterUpdateStatus(address _productToken, SupplyChainStatus _status) external {
        _productToken._transporterUpdateStatus(_status);
    }

    function retailerReceiveProduct(address _productToken, int64 _quantity) external payable {
        _productToken._retailerReceiveProduct(_quantity);
    }

    function getActiveDeliveries() external view returns (address[] memory) {
        return LibSupplyChain._getAllActiveDeliveriesAddress();
    }

    function getAllActiveDeliveries() external view returns (Product[] memory) {
        return LibSupplyChain._getAllActiveDeliveries();
    }

    function getRetailerOrders(address _retailer) external view returns (address[] memory) {
        return LibSupplyChain._getRetailerOrders(_retailer);
    }

    function getTransporterOrders(address _transporter) external view returns (address[] memory) {
        return LibSupplyChain._getTransporterOrders(_transporter);
    }

    function getSupplierOrders(address _supplier) external view returns (address[] memory) {
        return LibSupplyChain._getSupplierOrders(_supplier);
    }

    function getProductRetailers(address _productToken) external view returns (address[] memory) {
        return LibSupplyChain._getProductRetailers(_productToken);
    }

    function getProductTransporter(address _productToken) external view returns (address) {
        return LibSupplyChain._getProductTransporter(_productToken);
    }

    function getProductSuppliers(address _productToken) external view returns (address[] memory) {
        return LibSupplyChain._getProductSuppliers(_productToken);
    }

    function getProductSupplyChainStatus(address _productToken) external view returns (SupplyChainStatus) {
        return LibSupplyChain._getProductSupplyChainStatus(_productToken);
    }
}
