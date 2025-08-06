// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Role, Party, PARTY_ADMIN_ROLE} from "@chronicle-types/PartyStorage.sol";
import {LibParty} from "@chronicle/libraries/LibParty.sol";
import {LibOwnableRoles} from "@diamond/libraries/LibOwnableRoles.sol";

contract PartiesFacet {
    using LibParty for *;

    modifier onlyOwnerOrPartyAdmin() {
        LibOwnableRoles._checkOwnerOrRoles(PARTY_ADMIN_ROLE);
        _;
    }

    function registerParty(string calldata _name, Role _role) external {
        _name._registerParty(_role);
    }

    }

    function getAllActiveParties() public view returns (address[] memory) {
        return LibParty._getActiveParties();
    function freezeParty(address _addr) external onlyOwnerOrPartyAdmin {
        _addr._freezeParty();
    }

    function unfreezeParty(address _addr) external onlyOwnerOrPartyAdmin {
        _addr._unFreezeParty();
    }

    function getPartiesByRole(Role _role) public view returns (address[] memory) {
        return _role._getPartiesByRole();
    function hasActiveRole(address _addr, Role _role) public view returns (bool) {
        return _addr._hasActiveRole(_role);
    }

    function getSuppliers() public view returns (address[] memory) {
        return LibParty._getSuppliers();
    }

    function getTransporters() public view returns (address[] memory) {
        return LibParty._getTransporters();
    }

    function getRetailers() public view returns (address[] memory) {
        return LibParty._getRetailers();
    }
}
