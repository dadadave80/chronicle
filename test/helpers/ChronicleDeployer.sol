// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {DiamondCutFacet} from "@diamond/facets/DiamondCutFacet.sol";
import {DiamondLoupeFacet} from "@diamond/facets/DiamondLoupeFacet.sol";
import {OwnableRolesFacet} from "@diamond/facets/OwnableRolesFacet.sol";
import {ERC165Init} from "@diamond/initializers/ERC165Init.sol";
import {MultiInit} from "@diamond/initializers/MultiInit.sol";
import {FacetCutAction, FacetCut, DiamondArgs} from "@diamond/libraries/types/DiamondTypes.sol";
import {HelperContract} from "@diamond-test/helpers/HelperContract.sol";
import {Chronicle} from "@chronicle/Chronicle.sol";
import {PartiesFacet} from "@chronicle/facets/PartiesFacet.sol";
import {ProductsFacet} from "@chronicle/facets/ProductsFacet.sol";
import {InitHTCKeyTypes} from "@chronicle/initializers/InitHTCKeyTypes.sol";

abstract contract ChronicleDeployer is HelperContract {
    function _deployChronicle(address _owner) internal returns (address payable chronicle_) {
        // deploy facets
        DiamondCutFacet diamondCutFacet = new DiamondCutFacet();
        DiamondLoupeFacet diamondLoupeFacet = new DiamondLoupeFacet();
        OwnableRolesFacet ownableRolesFacet = new OwnableRolesFacet();
        PartiesFacet partiesFacet = new PartiesFacet();
        ProductsFacet productsFacet = new ProductsFacet();

        // deploy initializers
        MultiInit multiInit = new MultiInit();
        ERC165Init erc165Init = new ERC165Init();
        InitHTCKeyTypes initHtcKeyTypes = new InitHTCKeyTypes();

        FacetCut[] memory facetCuts = new FacetCut[](5);

        facetCuts[0] = FacetCut({
            facetAddress: address(diamondCutFacet),
            action: FacetCutAction.Add,
            functionSelectors: _generateSelectors("DiamondCutFacet")
        });

        facetCuts[1] = FacetCut({
            facetAddress: address(diamondLoupeFacet),
            action: FacetCutAction.Add,
            functionSelectors: _generateSelectors("DiamondLoupeFacet")
        });

        facetCuts[2] = FacetCut({
            facetAddress: address(ownableRolesFacet),
            action: FacetCutAction.Add,
            functionSelectors: _generateSelectors("OwnableRolesFacet")
        });

        facetCuts[3] = FacetCut({
            facetAddress: address(partiesFacet),
            action: FacetCutAction.Add,
            functionSelectors: _generateSelectors("PartiesFacet")
        });

        facetCuts[4] = FacetCut({
            facetAddress: address(productsFacet),
            action: FacetCutAction.Add,
            functionSelectors: _generateSelectors("ProductsFacet")
        });

        address[] memory initAddr = new address[](2);
        bytes[] memory initData = new bytes[](2);

        initAddr[0] = address(erc165Init);
        initData[0] = abi.encodeWithSignature("initERC165()");

        initAddr[1] = address(initHtcKeyTypes);
        initData[1] = abi.encodeWithSignature("initHtcKeyTypes()");

        DiamondArgs memory args = DiamondArgs({
            owner: _owner,
            init: address(multiInit),
            initData: abi.encodeWithSignature("multiInit(address[],bytes[])", initAddr, initData)
        });

        chronicle_ = payable(address(new Chronicle(facetCuts, args)));
    }
}
