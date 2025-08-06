// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// keccak256(abi.encode(uint256(keccak256("com.chainsight.supplychain.product")) - 1)) & ~bytes32(uint256(0xff));
bytes32 constant PRODUCT_STORAGE_SLOT = 0x3e8839e7c5f19510f7ec9b47b1276a08315ec604640593841cc770aa20d30d00;

struct ProductStorage {
    address usdcAddress;
    mapping(address => Product[]) products;
    EnumerableSet.AddressSet activeProducts;
}

enum Status {
    Created,
    ForSale,
    Sold,
    Shipped,
    Received
}

struct Product {
    uint24 id;
    address tokenAddress;
    string name;
    int64 price;
    int64 totalSupply;
    address owner;
    Status status;
    uint32 timestamp;
    int64[] serialNumbers;
}
