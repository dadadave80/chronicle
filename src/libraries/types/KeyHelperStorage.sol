// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

// keccak256(abi.encode(uint256(keccak256("com.hedera.hts.keyhelper.storage")) - 1)) & ~bytes32(uint256(0xff));
bytes32 constant KEYHELPER_STORAGE_SLOT = 0xf36989252aea929a9621c3812c53b3a78ebee43ecec902e8d0c7d0a24c8b3f00;

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
