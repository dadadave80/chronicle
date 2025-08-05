// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Diamond} from "@diamond/Diamond.sol";
import {DiamondArgs, FacetCut} from "@diamond/libraries/types/DiamondTypes.sol";

/// @notice Implements EIP-2535 Diamond proxy pattern, allowing dynamic addition, replacement, and removal of facets
/// @author ChainSight Protocol
/// NOTE: Replace `MyShinyDiamond` with your name or protocol
contract ChainSight is Diamond {
    /// @notice Initializes the Diamond proxy with the provided facets and initialization parameters
    /// @param _diamondCut Array of FacetCut structs defining facet addresses, corresponding function selectors, and actions (Add, Replace, Remove)
    /// @param _args Struct containing the initial owner address, optional init contract address, and init calldata
    constructor(FacetCut[] memory _diamondCut, DiamondArgs memory _args) payable Diamond(_diamondCut, _args) {}
}
