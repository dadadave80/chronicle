// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibProduct} from "@chronicle/libraries/LibProduct.sol";
import {Product} from "@chronicle-types/ProductStorage.sol";

contract ProductsFacet {
    using LibProduct for *;

    function createProduct(string calldata _name, int64 _price, int64 _initialSupply) external {
        _name._createProduct(_price, _initialSupply);
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

    function getOwnerProductTokenAddresses(address _owner) public view returns (address[] memory) {
        return _owner._getOwnerProductTokenAddresses();
    }

    function getOwnerProducts(address _owner) public view returns (Product[] memory) {
        return _owner._getOwnerProducts();
    }
}
