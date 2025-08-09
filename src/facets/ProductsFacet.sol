// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibProduct} from "@chronicle/libraries/LibProduct.sol";
import {Product} from "@chronicle-types/ProductStorage.sol";

/// @title ProductsFacet
/// @notice Facet for product creation, update, and quantity management in the supply chain.
contract ProductsFacet {
    using LibProduct for *;

    /// @notice Add a new product to the supply chain.
    /// @param _name The product name.
    /// @param _memo Arbitrary product memo.
    /// @param _price Product price in hbars.
    /// @param _transporterFee Fee paid to transporter.
    /// @param _initialSupply Initial product supply.
    function addProduct(
        string calldata _name,
        string calldata _memo,
        int64 _price,
        int64 _transporterFee,
        int64 _initialSupply
    ) external {
        _name._addProduct(_memo, _price, _transporterFee, _initialSupply);
    }

    /// @notice Update product metadata and fees.
    /// @param _tokenAddress Product token address.
    /// @param _name New product name.
    /// @param _memo New memo.
    /// @param _price New price in hbars.
    /// @param _transporterFee New transporter fee.
    function updateProduct(
        address _tokenAddress,
        string calldata _name,
        string calldata _memo,
        int64 _price,
        int64 _transporterFee
    ) external {
        _tokenAddress._updateProduct(_name, _memo, _price, _transporterFee);
    }

    /// @notice Mint more supply for a product.
    /// @param _tokenAddress Product token address.
    /// @param _quantity Amount to increase.
    function increaseProductQuantity(address _tokenAddress, int64 _quantity) external {
        _tokenAddress._increaseProductQuantity(_quantity);
    }

    /// @notice Burn supply from a product.
    /// @param _tokenAddress Product token address.
    /// @param _quantity Amount to decrease.
    function decreaseProductQuantity(address _tokenAddress, int64 _quantity) external {
        _tokenAddress._decreaseProductQuantity(_quantity);
    }

    /// @notice Get product details by token address.
    /// @param _tokenAddress Product token address.
    /// @return Product struct with details.
    function getProductByTokenAddress(address _tokenAddress) public view returns (Product memory) {
        return _tokenAddress._getProductByTokenAddress();
    }

    /// @notice Get all product token addresses.
    /// @return Array of product token addresses.
    function getAllProductsTokenAddress() public view returns (address[] memory) {
        return LibProduct._getAllProductsTokenAddress();
    }

    /// @notice Get all products.
    /// @return Array of Product structs.
    function getAllProducts() public view returns (Product[] memory) {
        return LibProduct._getAllProducts();
    }

    /// @notice Get the total count of products.
    /// @return Total count of products.
    function getProductsCount() public view returns (uint256) {
        return LibProduct._getProductsCount();
    }

    /// @notice Get products by range.
    /// @param _start Start index.
    /// @param _end End index.
    /// @return Array of Product structs.
    function getProductsByRange(uint8 _start, uint8 _end) public view returns (Product[] memory) {
        return LibProduct._getProductsByRange(_start, _end);
    }

    /// @notice Get all product token addresses for a supplier.
    /// @param _supplier Supplier address.
    /// @return Array of product token addresses.
    function getSupplierProductTokenAddresses(address _supplier) public view returns (address[] memory) {
        return _supplier._getSupplierProductTokenAddresses();
    }

    /// @notice Get all products for a supplier.
    /// @param _supplier Supplier address.
    /// @return Array of Product structs.
    function getSupplierProducts(address _supplier) public view returns (Product[] memory) {
        return _supplier._getSupplierProducts();
    }
}
