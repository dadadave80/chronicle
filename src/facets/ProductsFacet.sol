// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibProduct} from "@chronicle/libraries/LibProduct.sol";
import {Product} from "@chronicle-types/ProductStorage.sol";

contract ProductsFacet {
    using LibProduct for *;

    function addProduct(string calldata _name, string calldata _memo, int64 _price, int64 _initialSupply) external {
        _name._addProduct(_memo, _price, _initialSupply);
    }

    function updateProduct(address _tokenAddress, string calldata _name, string calldata _memo, int64 _price)
        external
    {
        _tokenAddress._updateProduct(_name, _memo, _price);
    }

    function getProductByTokenAddress(address _tokenAddress) public view returns (Product memory) {
        return _tokenAddress._getProductByTokenAddress();
    }

    function getAllProductTokenAddresses() public view returns (address[] memory) {
        return LibProduct._getAllProductTokenAddresses();
    }

    function getAllProducts() public view returns (Product[] memory) {
        return LibProduct._getAllProducts();
    }

    function getSupplierProductTokenAddresses(address _owner) public view returns (address[] memory) {
        return _owner._getSupplierProductTokenAddresses();
    }

    function getSupplierProducts(address _owner) public view returns (Product[] memory) {
        return _owner._getSupplierProducts();
    }
}
