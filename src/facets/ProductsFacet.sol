// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibProduct} from "@chronicle/libraries/LibProduct.sol";
import {Product} from "@chronicle-types/ProductStorage.sol";

contract ProductsFacet {
    using LibProduct for *;

    function createProduct(string calldata _name, int64 _price, int64 _initialSupply) external {
        _name._createProduct(_price, _initialSupply);
    }

    function getProduct(address _tokenAddress) public view returns (Product memory) {
        return _tokenAddress._getProduct();
    }

    function getProductTokenAddresses() public view returns (address[] memory) {
        return LibProduct._getProductTokenAddresses();
    }

    function getProducts() public view returns (Product[] memory) {
        return LibProduct._getProducts();
    }
}
