// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Role, Party} from "@chronicle-types/PartyStorage.sol";
import {LibParty} from "@chronicle/libraries/LibParty.sol";

/// @title PartiesFacet
/// @notice Facet for party registration, role management, and access control in the supply chain.
contract PartiesFacet {
    using LibParty for *;

    /// @notice Register a new party with a given name and role.
    /// @param _name The party's display name.
    /// @param _role The role to register for (Supplier, Transporter, Retailer).
    function registerParty(string calldata _name, Role _role) external {
        _name._registerParty(_role);
    }

    /// @notice Deactivate the caller's party for a specific role.
    /// @param _role The role to deactivate.
    function deactivateParty(Role _role) external {
        _role._deactivateParty();
    }

    /// @notice Freeze a party, disabling their activity.
    /// @param _addr The address of the party to freeze.
    function freezeParty(address _addr) external {
        _addr._freezeParty();
    }

    /// @notice Unfreeze a party, enabling their activity.
    /// @param _addr The address of the party to unfreeze.
    function unfreezeParty(address _addr) external {
        _addr._unFreezeParty();
    }

    /// @notice Check if an address has an active role.
    /// @param _addr The address to check.
    /// @param _role The role to check for.
    /// @return True if the address has the role and is active.
    function hasActiveRole(address _addr, Role _role) public view returns (bool) {
        return _addr._hasActiveRole(_role);
    }

    /// @notice Get party details for an address.
    /// @param _addr The address to query.
    /// @return Party struct with details.
    function getParty(address _addr) public view returns (Party memory) {
        return _addr._getParty();
    }

    /// @notice Get all active parties.
    /// @return Array of Party structs.
    function getActiveParties() public view returns (Party[] memory) {
        return LibParty._getActiveParties();
    }

    /// @notice Get all active parties for a given role.
    /// @param _role The role to filter by.
    /// @return Array of Party structs.
    function getActivePartiesByRole(Role _role) public view returns (Party[] memory) {
        return _role._getActivePartiesByRole();
    }

    /// @notice Get addresses of all active parties.
    /// @return Array of party addresses.
    function getActivePartiesAddress() public view returns (address[] memory) {
        return LibParty._getActivePartiesAddress();
    }

    /// @notice Get addresses of all active parties for a given role.
    /// @param _role The role to filter by.
    /// @return Array of party addresses.
    function getActivePartiesAddressByRole(Role _role) public view returns (address[] memory) {
        return _role._getActivePartiesAddressByRole();
    }
}
