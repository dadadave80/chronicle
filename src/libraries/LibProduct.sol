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
import {Status, Product, ProductStorage, PRODUCT_STORAGE_SLOT} from "@chainsight-types/ProductTypes.sol";
import {LibParty} from "@chainsight/libraries/LibParty.sol";
import {LibKeyHelper} from "@chainsight/libraries/hts/LibKeyHelper.sol";
import "@chainsight-logs/ProductLogs.sol";

library LibProduct {
    using EnumerableSet for EnumerableSet.AddressSet;

    function _productStorage() internal pure returns (ProductStorage storage prs_) {
        assembly {
            prs_.slot := PRODUCT_STORAGE_SLOT
        }
    }

    function _createProduct(string calldata _name, uint256 _price) internal {
        address sender = LibContext._msgSender();
        if (!LibParty._isActiveRole(sender, Role.Manufacturer)) revert("Not a Manufacturer");
        IHederaTokenService.KeyValue memory key = IHederaTokenService.KeyValue({
            inheritAccountKey: true,
            contractId: address(0),
            ed25519: "",
            ECDSA_secp256k1: "",
            delegatableContractId: address(0)
        });
        IHederaTokenService.TokenKey[] memory tokenKeys = new IHederaTokenService.TokenKey[](1);
        tokenKeys[0] = IHederaTokenService.TokenKey({keyType: 0, key: key});
        IHederaTokenService.HederaToken memory token;
        token.name = _name;
        token.symbol = "CSP";
        token.treasury = address(this);
        token.tokenKeys = tokenKeys;

        (int256 responseCode, address tokenAddress) = LibHederaTokenService.createNonFungibleToken(token);
        if (responseCode != HederaResponseCodes.SUCCESS) revert("Failed to create product");
        if (tokenAddress != address(0)) {
            _productStorage().activeProducts.add(tokenAddress);
            _productStorage().products[tokenAddress].push(
                Product({
                    tokenAddress: tokenAddress,
                    name: _name,
                    price: _price,
                    owner: sender,
                    status: Status.Created,
                    timestamp: block.timestamp
                })
            );
        }
        emit ProductCreated(tokenAddress, sender);
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
