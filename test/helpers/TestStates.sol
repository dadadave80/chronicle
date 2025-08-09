// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {DiamondCutFacet} from "@diamond/facets/DiamondCutFacet.sol";
import {DiamondLoupeFacet} from "@diamond/facets/DiamondLoupeFacet.sol";
import {OwnableRolesFacet} from "@diamond/facets/OwnableRolesFacet.sol";
import {PartiesFacet} from "@chronicle/facets/PartiesFacet.sol";
import {ProductsFacet} from "@chronicle/facets/ProductsFacet.sol";
import {SupplyChainFacet} from "@chronicle/facets/SupplyChainFacet.sol";
import {ChronicleDeployer} from "@chronicle-test/helpers/ChronicleDeployer.sol";

abstract contract DeployedChronicleState is ChronicleDeployer {
    address public chronicle;
    DiamondCutFacet public diamondCutFacet;
    DiamondLoupeFacet public diamondLoupeFacet;
    OwnableRolesFacet public ownableRolesFacet;
    PartiesFacet public partiesFacet;
    ProductsFacet public productsFacet;
    SupplyChainFacet public supplyChainFacet;
    address[] public facetAddresses;
    string[6] public facetNames = [
        "DiamondCutFacet",
        "DiamondLoupeFacet",
        "OwnableRolesFacet",
        "PartiesFacet",
        "ProductsFacet",
        "SupplyChainFacet"
    ];
    address public constant CHRONICLE_OWNER = address(1337);

    function setUp() public virtual {
        vm.prank(CHRONICLE_OWNER);
        chronicle = _deployChronicle(CHRONICLE_OWNER);

        diamondCutFacet = DiamondCutFacet(chronicle);
        diamondLoupeFacet = DiamondLoupeFacet(chronicle);
        ownableRolesFacet = OwnableRolesFacet(chronicle);
        partiesFacet = PartiesFacet(chronicle);
        productsFacet = ProductsFacet(chronicle);
        supplyChainFacet = SupplyChainFacet(chronicle);

        facetAddresses = diamondLoupeFacet.facetAddresses();
    }
}
