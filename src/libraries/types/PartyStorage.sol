// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// keccak256(abi.encode(uint256(keccak256("com.chainsight.supplychain.party")) - 1)) & ~bytes32(uint256(0xff));
bytes32 constant PARTY_STORAGE_SLOT = 0x79bc885c11052f413cd90742373a0102325375d78a2f6bc3047e5923c793ae00;

struct PartyStorage {
    mapping(address => Party) parties;
    mapping(Role => EnumerableSet.AddressSet) roles;
    EnumerableSet.AddressSet activeParties;
}

enum Role {
    Supplier,
    Transporter,
    Retailer
}

struct Party {
    string name;
    Role role;
    bool active;
    uint8 rating; // 0-5
}
