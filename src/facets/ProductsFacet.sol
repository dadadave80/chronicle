// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibProduct} from "@chronicle/libraries/LibProduct.sol";
import {Product} from "@chronicle-types/ProductStorage.sol";

contract ProductsFacet {
    using LibProduct for *;

    function addProduct(
        string calldata _name,
        string calldata _memo,
        int64 _price,
        int64 _transporterFee,
        int64 _initialSupply
    ) external {
        _name._addProduct(_memo, _price, _transporterFee, _initialSupply);
    }

    function updateProduct(
        address _tokenAddress,
        string calldata _name,
        string calldata _memo,
        int64 _price,
        int64 _transporterFee
    ) external {
        _tokenAddress._updateProduct(_name, _memo, _price, _transporterFee);
    }

    function increaseProductQuantity(address _tokenAddress, int64 _quantity) external {
        _tokenAddress._increaseProductQuantity(_quantity);
    }

    function decreaseProductQuantity(address _tokenAddress, int64 _quantity) external {
        _tokenAddress._decreaseProductQuantity(_quantity);
    }

    function getProductByTokenAddress(address _tokenAddress) public view returns (Product memory) {
        return _tokenAddress._getProductByTokenAddress();
    }

    function getAllProductsTokenAddress() public view returns (address[] memory) {
        return LibProduct._getAllProductsTokenAddress();
    }

    function getAllProducts() public view returns (Product[] memory) {
        return LibProduct._getAllProducts();
    }

    function getProductsCount() public view returns (uint256) {
        return LibProduct._getProductsCount();
    }

    function getProductsByRange(uint8 _start, uint8 _end) public view returns (Product[] memory) {
        return LibProduct._getProductsByRange(_start, _end);
    }

    function getSupplierProductTokenAddresses(address _supplier) public view returns (address[] memory) {
        return _supplier._getSupplierProductTokenAddresses();
    }

    function getSupplierProducts(address _supplier) public view returns (Product[] memory) {
        return _supplier._getSupplierProducts();
    }
}
