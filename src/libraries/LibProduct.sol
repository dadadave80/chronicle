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
    using LibParty for address;
    using LibKeyHelper for KeyType;
    using LibHederaTokenService for IHederaTokenService.HederaToken;

    function _productStorage() internal pure returns (ProductStorage storage pds_) {
        assembly {
            pds_.slot := PRODUCT_STORAGE_SLOT
        }
    }

    function _createProduct(string calldata _name, uint256 _price) internal {
        address sender = LibContext._msgSender();
        if (!sender._isActiveRole(Role.Supplier)) revert("Not a Supplier");

        (int256 responseCode, address tokenAddress) = _getProductToken(_name).createNonFungibleToken();

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
        tokenKeys_[0] = KeyType.ADMIN.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[1] = KeyType.KYC.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[2] = KeyType.FREEZE.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[3] = KeyType.WIPE.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[4] = KeyType.SUPPLY.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[5] = KeyType.FEE.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
        tokenKeys_[6] = KeyType.PAUSE.getSingleKey(KeyValueType.CONTRACT_ID, address(this));
    }

    function _getProductFees(int64 _price)
        internal
        view
        returns (IHederaTokenService.FixedFee[] memory fixedFees_, IHederaTokenService.RoyaltyFee[] memory royaltyFees_)
    {
        address usdcAddress = _productStorage().usdcAddress;

        fixedFees_ = new IHederaTokenService.FixedFee[](1);
        fixedFees_[0] = IHederaTokenService.FixedFee({
            amount: _price,
            tokenId: usdcAddress,
            useHbarsForPayment: false,
            useCurrentTokenForPayment: false,
            feeCollector: address(this)
        });

        royaltyFees_ = new IHederaTokenService.RoyaltyFee[](1);
        royaltyFees_[0] = IHederaTokenService.RoyaltyFee({
            numerator: 1,
            denominator: 1000,
            amount: _price,
            tokenId: usdcAddress,
            useHbarsForPayment: false,
            feeCollector: address(this)
        });
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
