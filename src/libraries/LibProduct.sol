// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IHederaTokenService} from "hedera-token-service/IHederaTokenService.sol";
import {HederaTokenService} from "hedera-token-service/HederaTokenService.sol";
import {KeyHelper} from "hedera-token-service/KeyHelper.sol";
import {HederaResponseCodes} from "hedera-system-contracts/HederaResponseCodes.sol";
import {LibHederaTokenService} from "@chainsight/libraries/hts/LibHederaTokenService.sol";
import {LibContext} from "@chainsight/libraries/LibContext.sol";
import {Role} from "@chainsight-types/PartyStorage.sol";
import {KeyType, KeyValueType} from "@chainsight-types/KeyHelperStorage.sol";
import {Status, Product, ProductStorage, PRODUCT_STORAGE_SLOT} from "@chainsight-types/ProductStorage.sol";
import {LibParty} from "@chainsight/libraries/LibParty.sol";
import {LibKeyHelper} from "@chainsight/libraries/hts/LibKeyHelper.sol";
import "@chainsight-logs/ProductLogs.sol";

library LibProduct {
    using EnumerableSet for EnumerableSet.AddressSet;

    function _productStorage() internal pure returns (ProductStorage storage pds_) {
        assembly {
            pds_.slot := PRODUCT_STORAGE_SLOT
        }
    }

    function _createProduct(string calldata _name, uint256 _price) internal {
        address sender = LibContext._msgSender();
        if (!LibParty._isActiveRole(sender, Role.Supplier)) revert("Not a Supplier");

        (int256 responseCode, address tokenAddress) =
            LibHederaTokenService.createNonFungibleToken(_getProductToken(_name));

        if (responseCode != HederaResponseCodes.SUCCESS) revert("Failed to create product");
        if (tokenAddress == address(0)) revert("Invalid token address");

        ProductStorage storage $ = _productStorage();
        $.activeProducts.add(tokenAddress);
        $.products[sender].push(
            Product({
                tokenAddress: tokenAddress,
                name: _name,
                price: _price,
                owner: sender,
                status: Status.Created,
                timestamp: block.timestamp
            })
        );

        emit ProductCreated(tokenAddress, sender);
    }

    function _getProductToken(string calldata _name)
        internal
        view
        returns (IHederaTokenService.HederaToken memory token_)
    {
        token_.name = _name;
        token_.symbol = "CSP";
        token_.treasury = address(this);
        token_.tokenKeys = _getProductTokenKeys();
    }

    function _getProductTokenKeys() internal view returns (IHederaTokenService.TokenKey[] memory tokenKeys_) {
        tokenKeys_ = new IHederaTokenService.TokenKey[](7);
        tokenKeys_[0] = LibKeyHelper.getSingleKey(KeyType.ADMIN, KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[1] = LibKeyHelper.getSingleKey(KeyType.KYC, KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[2] = LibKeyHelper.getSingleKey(KeyType.FREEZE, KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[3] = LibKeyHelper.getSingleKey(KeyType.WIPE, KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[4] = LibKeyHelper.getSingleKey(KeyType.SUPPLY, KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[5] = LibKeyHelper.getSingleKey(KeyType.FEE, KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[6] = LibKeyHelper.getSingleKey(KeyType.PAUSE, KeyValueType.CONTRACT_ID, address(this));
    }

    // function _transferProduct(uint256 _id, address _to, Status _newStatus) internal {

    //     emit ProductTransferred(_id, msg.sender, _to, _newStatus);
    // }

    // function getHistory(uint256 _id) external view returns (ProductHistory[] memory) {
    //     return history[_id];
    // }

    // function _getProductsByOwner(address _owner) internal view returns (Product[] memory) {
    //     // iterate stored products (or maintain owner → products index mapping)
    //     // for brevity, not fully implemented here
    //     revert("Not implemented");
    // }
}
