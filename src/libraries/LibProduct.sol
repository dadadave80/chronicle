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

    function _productStorage() internal pure returns (ProductStorage storage pds_) {
        assembly {
            pds_.slot := PRODUCT_STORAGE_SLOT
        }
    }

    function _addProduct(string calldata _name, string calldata _memo, int64 _price, int64 _initialSupply) internal {
        address sender = LibContext._msgSender();
        if (!sender._hasActiveRole(Role.Supplier)) revert("Not a Supplier");

        (int256 createResponseCode, address tokenAddress) = _createProductToken(_name, _memo, _price);
        if (createResponseCode != HederaResponseCodes.SUCCESS) revert("Failed to create product");
        if (tokenAddress == address(0)) revert("Invalid token address");

        (int256 mintResponseCode, int64 newTotalSupply, int64[] memory serialNumbers) =
            _mintProductToken(tokenAddress, _initialSupply);
        if (mintResponseCode != HederaResponseCodes.SUCCESS) revert("Failed to mint product");

        ProductStorage storage $ = _productStorage();
        $.activeProducts.add(tokenAddress);
        Product memory product = Product({
            id: uint32($.activeProducts.length()),
            tokenAddress: tokenAddress,
            name: _name,
            memo: _memo,
            price: _price,
            totalSupply: newTotalSupply,
            owner: sender,
            status: Status.Created,
            timestamp: uint40(block.timestamp)
        });
        $.tokenToProduct[tokenAddress] = product;
        $.supplierToProducts[sender].add(tokenAddress);

        emit ProductCreated(product, serialNumbers);
    }

    function _updateProduct(address _tokenAddress, string calldata _name, string calldata _memo, int64 _price)
        internal
    {
        ProductStorage storage $ = _productStorage();
        if (!$.activeProducts.contains(_tokenAddress)) revert("Invalid token address");
        if ($.tokenToProduct[_tokenAddress].owner != LibContext._msgSender()) revert("Not the owner");
        if (
            $.tokenToProduct[_tokenAddress].status != Status.Created
                || $.tokenToProduct[_tokenAddress].status != Status.ForSale
        ) revert("Product sold");

        _updateProductTokenInfo(_tokenAddress, _getProductToken(_name, _memo));
        _updateProductTokenFees(_tokenAddress, _price);

        Product memory product = $.tokenToProduct[_tokenAddress];
        product.name = _name;
        product.memo = _memo;
        product.price = _price;
        $.tokenToProduct[_tokenAddress] = product;

        emit ProductUpdated(product);
    }

    function _updateProductTokenInfo(address _tokenAddress, IHederaTokenService.HederaToken memory tokenInfo) private {
        int256 responseCode = _tokenAddress.updateTokenInfo(tokenInfo);
        if (responseCode != HederaResponseCodes.SUCCESS) revert("Failed to update product token info");
    }

    function _updateProductTokenFees(address _tokenAddress, int64 _price) private {
        (IHederaTokenService.FixedFee[] memory fixedFees, IHederaTokenService.RoyaltyFee[] memory royaltyFees) =
            _getProductFees(_price);
        int256 responseCode = _tokenAddress.updateNonFungibleTokenCustomFees(fixedFees, royaltyFees);
        if (responseCode != HederaResponseCodes.SUCCESS) revert("Failed to update product token fees");
    }

    function _createProductToken(string calldata _name, string calldata _memo, int64 _price)
        internal
        returns (int256 createResponseCode_, address tokenAddress_)
    {
        (IHederaTokenService.FixedFee[] memory fixedFees, IHederaTokenService.RoyaltyFee[] memory royaltyFees) =
            _getProductFees(_price);
        (createResponseCode_, tokenAddress_) =
            _getProductToken(_name, _memo).createNonFungibleTokenWithCustomFees(fixedFees, royaltyFees);
    }

    function _mintProductToken(address _tokenAddress, int64 _initialSupply)
        internal
        returns (int256 mintResponseCode_, int64 newTotalSupply_, int64[] memory serialNumbers_)
    {
        bytes[] memory metadata = new bytes[](0);
        (mintResponseCode_, newTotalSupply_, serialNumbers_) = _tokenAddress.mintToken(_initialSupply, metadata);
    }

    function _getProductToken(string calldata _name, string calldata _memo)
        internal
        view
        returns (IHederaTokenService.HederaToken memory token_)
    {
        token_.name = _name;
        token_.symbol = "CSP";
        token_.memo = _memo;
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
            tokenId: address(0),
            useHbarsForPayment: true,
            useCurrentTokenForPayment: false,
            feeCollector: address(this)
        });

        royaltyFees_ = new IHederaTokenService.RoyaltyFee[](1);
        royaltyFees_[0] = IHederaTokenService.RoyaltyFee({
            numerator: 1,
            denominator: 1000,
            amount: _price,
            tokenId: address(0),
            useHbarsForPayment: true,
            feeCollector: address(this)
        });
    }

    function _getProductByTokenAddress(address _tokenAddress) internal view returns (Product memory) {
        return _productStorage().tokenToProduct[_tokenAddress];
    }

    function _getAllProductTokenAddresses() internal view returns (address[] memory) {
        return _productStorage().activeProducts.values();
    }

    function _getAllProducts() internal view returns (Product[] memory products_) {
        address[] memory tokenAddresses = _getAllProductTokenAddresses();
        products_ = new Product[](tokenAddresses.length);
        for (uint256 i; i < tokenAddresses.length; ++i) {
            products_[i] = _getProductByTokenAddress(tokenAddresses[i]);
        }
    }

    function _getSupplierProductTokenAddresses(address _owner) internal view returns (address[] memory) {
        return _productStorage().supplierToProducts[_owner].values();
    }

    function _getSupplierProducts(address _owner) internal view returns (Product[] memory products_) {
        address[] memory tokenAddresses = _getSupplierProductTokenAddresses(_owner);
        products_ = new Product[](tokenAddresses.length);
        for (uint256 i; i < tokenAddresses.length; ++i) {
            products_[i] = _getProductByTokenAddress(tokenAddresses[i]);
        }
    }
}
