// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// keccak256(abi.encode(uint256(keccak256("chronicle.supplychain.party.storage")) - 1)) & ~bytes32(uint256(0xff));
bytes32 constant PARTY_STORAGE_SLOT = 0x0cf55988da33765c426b8514440d3fdfcb32e3512fbb0a9aa133306efdc05800;
// uint256(keccak256("chronicle.supplychain.party.admin"));
uint256 constant PARTY_ADMIN_ROLE = 63828454639333421246536306050401807180098045767738326822982641609786902800542;

struct PartyStorage {
    mapping(address => Party) parties;
    mapping(Role => EnumerableSet.AddressSet) roles;
    EnumerableSet.AddressSet activeParties;
}

enum Role {
    None,
    Supplier,
    Transporter,
    Retailer
}

enum Rating {
    Zero,
    One,
    Two,
    Three,
    Four,
    Five
}

struct Party {
    string name;
    address addr;
    Role role;
    bool active;
    bool frozen;
    Rating rating;
}
