// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {Party, Role, PartyStorage, PARTY_STORAGE_SLOT} from "@chronicle-types/PartyStorage.sol";
import {LibContext} from "@chronicle/libraries/LibContext.sol";
import "@chronicle-logs/PartyLogs.sol";

library LibParty {
    using EnumerableSet for EnumerableSet.AddressSet;

    function _partyStorage() internal pure returns (PartyStorage storage ps_) {
        assembly {
            ps_.slot := PARTY_STORAGE_SLOT
        }
    }

    function _registerParty(string calldata _name, Role _role) internal {
        PartyStorage storage $ = _partyStorage();
        address sender = LibContext._msgSender();
        if ($.parties[sender].frozen) revert("Party frozen");
        if (!$.roles[_role].add(sender)) revert("Role already exists");
        if (!$.activeParties.add(sender)) revert("Party already exists");
        $.parties[sender] = Party(_name, sender, _role, true, false, 0);
        emit PartyRegistered($.parties[sender]);
    }

    function _deactivateParty(Role _role) internal {
        PartyStorage storage $ = _partyStorage();
        address sender = LibContext._msgSender();
        if (!$.activeParties.remove(sender)) revert("Party not active");
        if (!$.roles[_role].remove(sender)) revert("Role not found");
        if ($.parties[sender].active) $.parties[sender].active = false;
        emit PartyDeactivated($.parties[sender]);
    }

    function _freezeParty(address _addr) internal {
        _partyStorage().parties[_addr].frozen = true;
    }

    function _unFreezeParty(address _addr) internal {
        _partyStorage().parties[_addr].frozen = false;
    }

    function _hasRole(Role _role) internal view returns (bool) {
        return _partyStorage().roles[_role].contains(LibContext._msgSender());
    }

    function _hasActiveRole(address _addr, Role _role) internal view returns (bool) {
        Party memory p = _partyStorage().parties[_addr];
        return p.active && p.role == _role;
    }

    function _getParty(address _addr) internal view returns (Party memory) {
        return _partyStorage().parties[_addr];
    }

    function _getActiveParties() internal view returns (Party[] memory parties_) {
        PartyStorage storage $ = _partyStorage();
        uint256 length = $.activeParties.length();
        parties_ = new Party[](length);
        for (uint256 i; i < length; ++i) {
            parties_[i] = $.parties[$.activeParties.at(i)];
        }
    }

    function _getActivePartiesByRole(Role _role) internal view returns (Party[] memory parties_) {
        PartyStorage storage $ = _partyStorage();
        uint256 length = $.roles[_role].length();
        parties_ = new Party[](length);
        for (uint256 i; i < length; ++i) {
            parties_[i] = $.parties[$.roles[_role].at(i)];
        }
    }

    function _getActivePartiesAddress() internal view returns (address[] memory) {
        return _partyStorage().activeParties.values();
    }

    function _getActivePartiesAddressByRole(Role _role) internal view returns (address[] memory) {
        return _partyStorage().roles[_role].values();
    }
}
