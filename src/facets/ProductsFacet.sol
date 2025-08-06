// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibProduct} from "@chronicle/libraries/LibProduct.sol";

contract ProductsFacet {
    using LibProduct for *;

    function createProduct(string calldata _name, int64 _price, int64 _initialSupply) external {
        _name._createProduct(_price, _initialSupply);
    }
}
