// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Role} from "@chronicle-types/PartyStorage.sol";
import {LibParty} from "@chronicle/libraries/LibParty.sol";

contract PartiesFacet {
    using LibParty for *;

    function registerParty(string calldata _name, Role _role) external {
        _name._registerParty(_role);
    }

    function isActiveRole(address _addr, Role _role) public view returns (bool) {
        return _addr._isActiveRole(_role);
    }

    function getAllActiveParties() public view returns (address[] memory) {
        return LibParty._getActiveParties();
    }

    function getPartiesByRole(Role _role) public view returns (address[] memory) {
        return _role._getPartiesByRole();
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
