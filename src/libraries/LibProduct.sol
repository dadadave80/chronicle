// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IHederaTokenService} from "hedera-token-service/IHederaTokenService.sol";
import {HederaTokenService} from "hedera-token-service/HederaTokenService.sol";
import {KeyHelper} from "hedera-token-service/KeyHelper.sol";
import {HederaResponseCodes} from "hedera-system-contracts/HederaResponseCodes.sol";
import {LibHederaTokenService} from "@chronicle/libraries/hts/LibHederaTokenService.sol";
import {LibContext} from "@chronicle/libraries/LibContext.sol";
import {Role} from "@chronicle-types/PartyStorage.sol";
import {KeyType, KeyValueType} from "@chronicle-types/KeyHelperStorage.sol";
import {Status, Product, ProductStorage, PRODUCT_STORAGE_SLOT} from "@chronicle-types/ProductStorage.sol";
import {LibParty} from "@chronicle/libraries/LibParty.sol";
import {LibKeyHelper} from "@chronicle/libraries/hts/LibKeyHelper.sol";
import "@chronicle-logs/ProductLogs.sol";

library LibProduct {
    using LibParty for address;
    using LibKeyHelper for KeyType;
    using LibHederaTokenService for IHederaTokenService.HederaToken;
    using LibHederaTokenService for address;
    using EnumerableSet for EnumerableSet.AddressSet;

    address constant usdcAddress = address(0x0000000000000000000000000000000000068cDa);

    function _productStorage() internal pure returns (ProductStorage storage pds_) {
        assembly {
            pds_.slot := PRODUCT_STORAGE_SLOT
        }
    }

    function _createProduct(string calldata _name, int64 _price, int64 _initialSupply) internal {
        address sender = LibContext._msgSender();
        if (!sender._hasActiveRole(Role.Supplier)) revert("Not a Supplier");

        (int256 createResponseCode, address tokenAddress) = _createProductToken(_name, _price);
        if (createResponseCode != HederaResponseCodes.SUCCESS) revert("Failed to create product");
        if (tokenAddress == address(0)) revert("Invalid token address");

        (int256 mintResponseCode, int64 newTotalSupply, int64[] memory serialNumbers) =
            _mintProductToken(tokenAddress, _initialSupply);
        if (mintResponseCode != HederaResponseCodes.SUCCESS) revert("Failed to mint product");

        ProductStorage storage $ = _productStorage();
        $.activeProducts.add(tokenAddress);
        Product memory product = Product({
            id: uint24($.activeProducts.length()),
            tokenAddress: tokenAddress,
            name: _name,
            price: _price,
            totalSupply: newTotalSupply,
            owner: sender,
            status: Status.Created,
            timestamp: uint32(block.timestamp),
            serialNumbers: serialNumbers
        });
        $.tokenToProduct[tokenAddress] = product;

        emit ProductCreated(product);
    }

    function _createProductToken(string calldata _name, int64 _price)
        internal
        returns (int256 createResponseCode_, address tokenAddress_)
    {
        (IHederaTokenService.FixedFee[] memory fixedFees, IHederaTokenService.RoyaltyFee[] memory royaltyFees) =
            _getProductFees(_price);
        (createResponseCode_, tokenAddress_) =
            _getProductToken(_name).createNonFungibleTokenWithCustomFees(fixedFees, royaltyFees);
    }

    function _mintProductToken(address _tokenAddress, int64 _initialSupply)
        internal
        returns (int256 mintResponseCode_, int64 newTotalSupply_, int64[] memory serialNumbers_)
    {
        bytes[] memory metadata = new bytes[](0);
        (mintResponseCode_, newTotalSupply_, serialNumbers_) = _tokenAddress.mintToken(_initialSupply, metadata);
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

    function _getProduct(address _tokenAddress) internal view returns (Product memory) {
        return _productStorage().tokenToProduct[_tokenAddress];
    }

    function _getProductTokenAddresses() internal view returns (address[] memory) {
        return _productStorage().activeProducts.values();
    }

    function _getProducts() internal view returns (Product[] memory products_) {
        address[] memory tokenAddresses = _getProductTokenAddresses();
        products_ = new Product[](tokenAddresses.length);
        for (uint256 i; i < tokenAddresses.length; ++i) {
            products_[i] = _getProduct(tokenAddresses[i]);
        }
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
