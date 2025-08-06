// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// keccak256(abi.encode(uint256(keccak256("chronicle.supplychain.party.storage")) - 1)) & ~bytes32(uint256(0xff));
bytes32 constant PARTY_STORAGE_SLOT = 0x0cf55988da33765c426b8514440d3fdfcb32e3512fbb0a9aa133306efdc05800;

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
