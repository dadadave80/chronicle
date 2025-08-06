// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {LibOwnableRoles} from "@diamond/libraries/LibOwnableRoles.sol";
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

    modifier onlyOwner() {
        LibOwnableRoles._checkOwner();
        _;
    }

    modifier onlyOwnerOrRoles(Role _role) {
        LibOwnableRoles._checkOwnerOrRoles(uint256(keccak256(abi.encodePacked(LibContext._msgSender(), _role))));
        _;
    }

    function _registerParty(string calldata _name, Role _role) internal {
        PartyStorage storage $ = _partyStorage();
        address sender = LibContext._msgSender();
        LibOwnableRoles._grantRoles(sender, uint256(keccak256(abi.encodePacked(sender, _role))));
        $.parties[sender] = Party(_name, _role, true, 0);
        $.activeParties.add(sender);
        $.roles[_role].add(sender);
        emit PartyRegistered(sender, _name, _role);
    }

    function _deactivateParty(Role _role) internal onlyOwnerOrRoles(_role) {
        PartyStorage storage $ = _partyStorage();
        address sender = LibContext._msgSender();
        $.parties[sender].active = false;
        $.activeParties.remove(sender);
        emit PartyDeactivated(sender);
    }

    function _reactivateParty(Role _role) internal onlyOwnerOrRoles(_role) {
        PartyStorage storage $ = _partyStorage();
        address sender = LibContext._msgSender();
        $.parties[sender].active = true;
        $.activeParties.add(sender);
        emit PartyActivated(sender);
    }

    function _isRole(Role _role) internal view returns (bool) {
        return _partyStorage().roles[_role].contains(LibContext._msgSender());
    }

    function _isActiveRole(address _addr, Role _role) internal view returns (bool) {
        Party memory p = _partyStorage().parties[_addr];
        return p.active && p.role == _role;
    }

    function _getActiveParties() internal view returns (address[] memory) {
        return _partyStorage().activeParties.values();
    }

    function _getPartiesByRole(Role _role) internal view returns (address[] memory) {
        return _partyStorage().roles[_role].values();
    }

    function _getSuppliers() internal view returns (address[] memory) {
        return _partyStorage().roles[Role.Supplier].values();
    }

    function _getTransporters() internal view returns (address[] memory) {
        return _partyStorage().roles[Role.Transporter].values();
    }

    function _getRetailers() internal view returns (address[] memory) {
        return _partyStorage().roles[Role.Retailer].values();
    }
}
