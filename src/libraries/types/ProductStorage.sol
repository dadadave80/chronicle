// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// keccak256(abi.encode(uint256(keccak256("chronicle.supplychain.product.storage")) - 1)) & ~bytes32(uint256(0xff));
bytes32 constant PRODUCT_STORAGE_SLOT = 0x23ca794864a71b2543ff5b6b61845c569bb17e59b31809bb780b2c6fa0284000;
address constant USDC_ADDRESS = address(0x0000000000000000000000000000000000068cDa);

struct ProductStorage {
    mapping(address => Product) tokenToProduct;
    mapping(address => EnumerableSet.AddressSet) supplierToProducts;
    EnumerableSet.AddressSet activeProducts;
}

enum ProductStatus {
    None,
    ForSale,
    Ordered,
    Assigned,
    Sold
}

struct Product {
    uint32 id;
    address tokenAddress;
    string name;
    string memo;
    int64 price;
    int64 transportFee;
    int64 totalSupply;
    address supplier;
    ProductStatus status;
    uint40 created;
    uint40 updated;
}
