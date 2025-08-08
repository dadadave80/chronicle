// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IHederaTokenService} from "hedera-token-service/IHederaTokenService.sol";
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

    //*//////////////////////////////////////////////////////////////////////////
    //                                  STORAGE
    //////////////////////////////////////////////////////////////////////////*//
    function _productStorage() internal pure returns (ProductStorage storage pds_) {
        assembly {
            pds_.slot := PRODUCT_STORAGE_SLOT
        }
    }

    //*//////////////////////////////////////////////////////////////////////////
    //                             INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*//
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

    function _increaseProductQuantity(address _tokenAddress, int64 _quantity) internal {
        ProductStorage storage $ = _productStorage();
        if (!$.activeProducts.contains(_tokenAddress)) revert("Invalid token address");
        if ($.tokenToProduct[_tokenAddress].owner != LibContext._msgSender()) revert("Not the owner");
        if ($.tokenToProduct[_tokenAddress].status != Status.Created) revert("Product sold");

        (int256 mintResponseCode, int64 newTotalSupply, int64[] memory serialNumbers) =
            _mintProductToken(_tokenAddress, _quantity);
        if (mintResponseCode != HederaResponseCodes.SUCCESS) revert("Failed to mint product");

        Product memory product = $.tokenToProduct[_tokenAddress];
        product.totalSupply = newTotalSupply;
        $.tokenToProduct[_tokenAddress] = product;

        emit ProductQuantityIncreased(product, serialNumbers);
    }

    function _decreaseProductQuantity(address _tokenAddress, int64 _quantity, int64[] memory _serialNumbers) internal {
        ProductStorage storage $ = _productStorage();
        if (!$.activeProducts.contains(_tokenAddress)) revert("Invalid token address");
        if ($.tokenToProduct[_tokenAddress].owner != LibContext._msgSender()) revert("Not the owner");
        if ($.tokenToProduct[_tokenAddress].status != Status.Created) revert("Product sold");

        (int256 burnResponseCode, int64 newTotalSupply) = _tokenAddress.burnToken(_quantity, _serialNumbers);
        if (burnResponseCode != HederaResponseCodes.SUCCESS) revert("Failed to burn product");

        Product memory product = $.tokenToProduct[_tokenAddress];
        product.totalSupply = newTotalSupply;
        $.tokenToProduct[_tokenAddress] = product;

        emit ProductQuantityDecreased(product, _serialNumbers);
    }

    //*//////////////////////////////////////////////////////////////////////////
    //                               VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*//
    function _getProductByTokenAddress(address _tokenAddress) internal view returns (Product memory) {
        return _productStorage().tokenToProduct[_tokenAddress];
    }

    function _getAllProductsTokenAddress() internal view returns (address[] memory) {
        return _productStorage().activeProducts.values();
    }

    function _getAllProducts() internal view returns (Product[] memory products_) {
        address[] memory tokenAddresses = _getAllProductsTokenAddress();
        products_ = new Product[](tokenAddresses.length);
        for (uint256 i; i < tokenAddresses.length; ++i) {
            products_[i] = _getProductByTokenAddress(tokenAddresses[i]);
        }
    }

    function _getProductsCount() internal view returns (uint256) {
        return _productStorage().activeProducts.length();
    }

    // TODO: implement
    // function _getProductsByPage(uint8 _page, uint8 _pageSize) internal view returns (Product[] memory products_) {
    //     uint256 numOfProducts = _getNumberOfProducts();
    //     if (_pageSize > numOfProducts) return _getAllProducts();
    //     uint8 remNumOfProducts = uint8(numOfProducts % _pageSize);
    //     uint8 rngNumOfProducts = uint8(numOfProducts - remNumOfProducts);
    //     uint8 pages = rngNumOfProducts / _pageSize;
    //     // products_ = (_page > pages) ?  ;

    //     // uint256 startIndex = (_page - 1) * _pageSize;
    //     // uint256 endIndex = _page * _pageSize;
    //     // if (endIndex > numberOfProducts) endIndex = numberOfProducts;
    //     // products_ = new Product[](endIndex - startIndex);
    //     // for (uint256 i; i < endIndex - startIndex; ++i) {
    //     //     products_[i] = _getProductByTokenAddress(_productStorage().activeProducts.at(startIndex + i));
    //     // }
    // }

    function _getProductsByRange(uint8 _start, uint8 _end) internal view returns (Product[] memory products_) {
        products_ = new Product[](_end - _start);
        for (_start; _start < _end; ++_start) {
            products_[_start] = _getProductByTokenAddress(_productStorage().activeProducts.at(_start));
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

    //*//////////////////////////////////////////////////////////////////////////
    //                             PRIVATE FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*//
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
        private
        returns (int256 createResponseCode_, address tokenAddress_)
    {
        (IHederaTokenService.FixedFee[] memory fixedFees, IHederaTokenService.RoyaltyFee[] memory royaltyFees) =
            _getProductFees(_price);
        (createResponseCode_, tokenAddress_) =
            _getProductToken(_name, _memo).createNonFungibleTokenWithCustomFees(fixedFees, royaltyFees);
    }

    function _mintProductToken(address _tokenAddress, int64 _initialSupply)
        private
        returns (int256 mintResponseCode_, int64 newTotalSupply_, int64[] memory serialNumbers_)
    {
        bytes[] memory metadata = new bytes[](0);
        (mintResponseCode_, newTotalSupply_, serialNumbers_) = _tokenAddress.mintToken(_initialSupply, metadata);
    }

    function _getProductToken(string calldata _name, string calldata _memo)
        private
        view
        returns (IHederaTokenService.HederaToken memory token_)
    {
        token_.name = _name;
        token_.symbol = "CSP";
        token_.memo = _memo;
        token_.treasury = address(this);
        token_.tokenKeys = _getProductTokenKeys();
    }

    function _getProductTokenKeys() private view returns (IHederaTokenService.TokenKey[] memory tokenKeys_) {
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
        private
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
}
