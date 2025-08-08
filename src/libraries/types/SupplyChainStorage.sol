// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// keccak256(abi.encode(uint256(keccak256("chronicle.supplychain.storage")) - 1)) & ~bytes32(uint256(0xff));
bytes32 constant SUPPLYCHAIN_STORAGE_SLOT = 0xd78b51da6bf3447d06fc134310e80d3fca28d8b4ce3b67d10493eb303d209800;
// uint256(keccak256("chronicle.supplychain.admin"));
uint256 constant SUPPLYCHAIN_ADMIN_ROLE = 56670119067705456134706792050423419419426626061535994049731000446794313470214;
uint256 constant DELIVERY_DURATION = 7 days;
uint256 constant DISCOUNT_RATE = 100 wei;

struct SupplyChainStorage {
    mapping(address => EnumerableSet.AddressSet) retailerToProducts;
    mapping(address => EnumerableSet.AddressSet) transporterToProducts;
    mapping(address => EnumerableSet.AddressSet) supplierToProducts;
    mapping(address => EnumerableSet.AddressSet) productToRetailers;
    mapping(address => address) productToTransporter;
    mapping(address => EnumerableSet.AddressSet) productToSuppliers;
    mapping(address => SupplyChainStatus) productSupplyStatus;
    mapping(address => mapping(address => SupplyChainStatus)) transporterToProductSupplyChainStatus;
    EnumerableSet.AddressSet allOrderedProducts;
    EnumerableSet.AddressSet activeProductDeliveries;
}

enum SupplyChainStatus {
    None,
    Assigned,
    EnRouteToPickup,
    AtPickupLocation,
    Loading,
    PickedUp,
    InTransit,
    AtDeliveryLocation,
    Unloading,
    Delivered,
    Delayed,
    IssueReported
}
