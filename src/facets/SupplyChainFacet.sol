// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {LibSupplyChain} from "@chronicle/libraries/LibSupplyChain.sol";
import {SupplyChainStatus} from "@chronicle-types/SupplyChainStorage.sol";
import {Product} from "@chronicle-types/ProductStorage.sol";

/// @title SupplyChainFacet
/// @notice Facet for supply chain event handling and product delivery workflow.
contract SupplyChainFacet {
    using LibSupplyChain for address;

    /// @notice Retailer places an order for a product.
    /// @param _productToken Product token address.
    /// @param _quantity Quantity to order.
    function retailerOrderProduct(address _productToken, int64 _quantity) external payable {
        _productToken._retailerOrderProduct(_quantity);
    }

    /// @notice Transporter selects an order to fulfill.
    /// @param _productToken Product token address.
    /// @param _quantity Quantity to transport.
    function transporterSelectOrder(address _productToken, int64 _quantity) external payable {
        _productToken._transporterSelectOrder(_quantity);
    }

    /// @notice Transporter updates delivery status for a product.
    /// @param _productToken Product token address.
    /// @param _status New supply chain status.
    function transporterUpdateStatus(address _productToken, SupplyChainStatus _status) external {
        _productToken._transporterUpdateStatus(_status);
    }

    /// @notice Retailer receives delivered product.
    /// @param _productToken Product token address.
    /// @param _quantity Quantity received.
    function retailerReceiveProduct(address _productToken, int64 _quantity) external payable {
        _productToken._retailerReceiveProduct(_quantity);
    }

    /// @notice Get all active product delivery addresses.
    /// @return Array of product token addresses.
    function getActiveDeliveries() external view returns (address[] memory) {
        return LibSupplyChain._getAllActiveDeliveriesAddress();
    }

    /// @notice Get all active product deliveries.
    /// @return Array of Product structs.
    function getAllActiveDeliveries() external view returns (Product[] memory) {
        return LibSupplyChain._getAllActiveDeliveries();
    }

    /// @notice Get all orders for a retailer.
    /// @param _retailer Retailer address.
    /// @return Array of product token addresses.
    function getRetailerOrders(address _retailer) external view returns (address[] memory) {
        return LibSupplyChain._getRetailerOrders(_retailer);
    }

    /// @notice Get all orders for a transporter.
    /// @param _transporter Transporter address.
    /// @return Array of product token addresses.
    function getTransporterOrders(address _transporter) external view returns (address[] memory) {
        return LibSupplyChain._getTransporterOrders(_transporter);
    }

    /// @notice Get all orders for a supplier.
    /// @param _supplier Supplier address.
    /// @return Array of product token addresses.
    function getSupplierOrders(address _supplier) external view returns (address[] memory) {
        return LibSupplyChain._getSupplierOrders(_supplier);
    }

    /// @notice Get all retailers for a product.
    /// @param _productToken Product token address.
    /// @return Array of retailer addresses.
    function getProductRetailers(address _productToken) external view returns (address[] memory) {
        return LibSupplyChain._getProductRetailers(_productToken);
    }

    /// @notice Get the transporter for a product.
    /// @param _productToken Product token address.
    /// @return Transporter address.
    function getProductTransporter(address _productToken) external view returns (address) {
        return LibSupplyChain._getProductTransporter(_productToken);
    }

    /// @notice Get all suppliers for a product.
    /// @param _productToken Product token address.
    /// @return Array of supplier addresses.
    function getProductSuppliers(address _productToken) external view returns (address[] memory) {
        return LibSupplyChain._getProductSuppliers(_productToken);
    }

    /// @notice Get the supply chain status for a product.
    /// @param _productToken Product token address.
    /// @return Current supply chain status.
    function getProductSupplyChainStatus(address _productToken) external view returns (SupplyChainStatus) {
        return LibSupplyChain._getProductSupplyChainStatus(_productToken);
    }
}
