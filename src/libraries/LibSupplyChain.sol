// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Role} from "@chronicle-types/PartyStorage.sol";
import {Status} from "@chronicle-types/ProductStorage.sol";
import {LibParty} from "@chronicle/libraries/LibParty.sol";
import {LibProduct} from "@chronicle/libraries/LibProduct.sol";
import {LibContext} from "@chronicle/libraries/LibContext.sol";

library LibSupplyChain {
    using LibParty for address;
    using LibProduct for address;

    function _buyProduct(address _tokenAddress, uint256 _quantity) internal {
        address sender = LibContext._msgSender();
        if (!sender._hasActiveRole(Role.Retailer)) revert("Not a Retailer");
        if (_tokenAddress._getProductByTokenAddress().status != Status.ForSale) revert("Product not available");
    }
}
