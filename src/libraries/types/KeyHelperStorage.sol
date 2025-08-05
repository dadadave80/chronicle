// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

// keccak256(abi.encode(uint256(keccak256("com.chainsight.supplychain.keyhelper")) - 1)) & ~bytes32(uint256(0xff));
bytes32 constant KEYHELPER_STORAGE_SLOT = 0x8af20a423babd3869b8e64d46cf3adb4ec2164fad5677b47c578153625f04d00;

struct KeyHelperStorage {
    address supplyContract;
    mapping(KeyType => uint256) keyTypes;
}

enum KeyType {
    ADMIN,
    KYC,
    FREEZE,
    WIPE,
    SUPPLY,
    FEE,
    PAUSE
}

enum KeyValueType {
    INHERIT_ACCOUNT_KEY,
    CONTRACT_ID,
    ED25519,
    SECP256K1,
    DELEGETABLE_CONTRACT_ID
}
