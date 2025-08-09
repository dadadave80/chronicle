// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {PartiesFacet} from "@chronicle/facets/PartiesFacet.sol";
import {ProductsFacet} from "@chronicle/facets/ProductsFacet.sol";
import {SupplyChainFacet} from "@chronicle/facets/SupplyChainFacet.sol";
import {DiamondCutFacet} from "@diamond/facets/DiamondCutFacet.sol";
import {DiamondLoupeFacet} from "@diamond/facets/DiamondLoupeFacet.sol";
import {OwnableRolesFacet} from "@diamond/facets/OwnableRolesFacet.sol";
import {Role, Rating} from "@chronicle-types/PartyStorage.sol";

contract ChroniclePreviewnetStateTest is Test {
    DiamondCutFacet public diamondCutFacet;
    DiamondLoupeFacet public diamondLoupeFacet;
    OwnableRolesFacet public ownableRolesFacet;
    PartiesFacet public partiesFacet;
    ProductsFacet public productsFacet;
    SupplyChainFacet public supplyChainFacet;

    uint256 previewnetFork;
    string PRE_RPC_URL = vm.envString("PRE_RPC_URL");

    address TESTER = makeAddr("tester");

    modifier previewnet() {
        _previewnetSetup();
        _;
    }

    function setUp() public {
        previewnetFork = vm.createFork(PRE_RPC_URL);
    }

    function test_ChronicleOwner() public previewnet {
        assertEq(ownableRolesFacet.owner(), vm.envAddress("PRE_CHR_OWNER"));
    }

    function test_RegisterParty() public previewnet {
        vm.startPrank(TESTER);
        partiesFacet.registerParty("Party", Role.Retailer);

        assertTrue(partiesFacet.hasActiveRole(TESTER, Role.Retailer));
        assertEq(partiesFacet.getParty(TESTER).name, "Party");
        assertEq(partiesFacet.getParty(TESTER).addr, TESTER);
        assertEq(uint8(partiesFacet.getParty(TESTER).role), uint8(Role.Retailer));
        assertEq(partiesFacet.getParty(TESTER).active, true);
        assertEq(partiesFacet.getParty(TESTER).frozen, false);
        assertEq(uint8(partiesFacet.getParty(TESTER).rating), uint8(Rating.Zero));
    }

    function _previewnetSetup() internal {
        vm.selectFork(previewnetFork);

        diamondCutFacet = DiamondCutFacet(payable(vm.envAddress("PRE_CHR_ADDR")));
        diamondLoupeFacet = DiamondLoupeFacet(payable(vm.envAddress("PRE_CHR_ADDR")));
        ownableRolesFacet = OwnableRolesFacet(payable(vm.envAddress("PRE_CHR_ADDR")));
        partiesFacet = PartiesFacet(payable(vm.envAddress("PRE_CHR_ADDR")));
        productsFacet = ProductsFacet(payable(vm.envAddress("PRE_CHR_ADDR")));
        supplyChainFacet = SupplyChainFacet(payable(vm.envAddress("PRE_CHR_ADDR")));
    }
}
