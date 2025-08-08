// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {LibKeyHelper} from "@chronicle/libraries/hts/LibKeyHelper.sol";
import {KeyType, KeyHelperStorage} from "@chronicle-types/KeyHelperStorage.sol";

contract InitHTCKeyTypes {
    function initHtcKeyTypes() external {
        KeyHelperStorage storage $ = LibKeyHelper._getKeyHelperStorage();
        $.keyTypes[KeyType.ADMIN] = 1;
        $.keyTypes[KeyType.KYC] = 2;
        $.keyTypes[KeyType.FREEZE] = 4;
        $.keyTypes[KeyType.WIPE] = 8;
        $.keyTypes[KeyType.SUPPLY] = 16;
        $.keyTypes[KeyType.FEE] = 32;
        $.keyTypes[KeyType.PAUSE] = 64;
    }
}
