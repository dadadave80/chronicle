// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Role, Party} from "@chronicle-types/PartyStorage.sol";
import {LibParty} from "@chronicle/libraries/LibParty.sol";

contract PartiesFacet {
    using LibParty for *;

    function registerParty(string calldata _name, Role _role) external {
        _name._registerParty(_role);
    }

    function deactivateParty(Role _role) external {
        _role._deactivateParty();
    }

    function freezeParty(address _addr) external {
        _addr._freezeParty();
    }

    function unfreezeParty(address _addr) external {
        _addr._unFreezeParty();
    }

    function hasActiveRole(address _addr, Role _role) public view returns (bool) {
        return _addr._hasActiveRole(_role);
    }

    function getParty(address _addr) public view returns (Party memory) {
        return _addr._getParty();
    }

    function getActiveParties() public view returns (Party[] memory) {
        return LibParty._getActiveParties();
    }

    function getActivePartiesByRole(Role _role) public view returns (Party[] memory) {
        return _role._getActivePartiesByRole();
    }

    function getActivePartiesAddress() public view returns (address[] memory) {
        return LibParty._getActivePartiesAddress();
    }

    function getActivePartiesAddressByRole(Role _role) public view returns (address[] memory) {
        return _role._getActivePartiesAddressByRole();
    }
}
