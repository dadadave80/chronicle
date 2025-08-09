// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Facet} from "@diamond/libraries/types/DiamondTypes.sol";
import {DeployedChronicleState} from "@chronicle-test/helpers/TestStates.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IDiamondCut} from "@diamond/interfaces/IDiamondCut.sol";
import {IDiamondLoupe} from "@diamond/interfaces/IDiamondLoupe.sol";

contract ChronicleTest is DeployedChronicleState {
    function test_ChronicleDeployed() public view {
        assertNotEq(chronicle, address(0));
    }

    function test_ChronicleOwner() public view {
        assertEq(ownableRolesFacet.owner(), CHRONICLE_OWNER);
    }

    function test_ChronicleFacetsDeployed() public view {
        assertEq(facetAddresses.length, 6);
        for (uint256 i; i < facetAddresses.length; ++i) {
            assertNotEq(address(facetAddresses[i]), address(0));
        }
    }

    function test_SelectorsAreComplete() public {
        for (uint256 i; i < facetAddresses.length; ++i) {
            bytes4[] memory fromGenSelectors = _generateSelectors(facetNames[i]);
            for (uint256 j; j < fromGenSelectors.length; ++j) {
                assertEq(facetAddresses[i], diamondLoupeFacet.facetAddress(fromGenSelectors[j]));
            }
        }
    }

    function test_SelectorsAreUnique() public view {
        bytes4[] memory allSelectors = getAllSelectors(address(chronicle));
        for (uint256 i; i < allSelectors.length; ++i) {
            for (uint256 j = i + 1; j < allSelectors.length; ++j) {
                assertNotEq(allSelectors[i], allSelectors[j]);
            }
        }
    }

    function test_SelectorToFacetMappingIsCorrect() public view {
        Facet[] memory facetsList = diamondLoupeFacet.facets();
        for (uint256 i; i < facetsList.length; ++i) {
            for (uint256 j; j < facetsList[i].functionSelectors.length; ++j) {
                bytes4 selector = facetsList[i].functionSelectors[j];
                address expected = facetsList[i].facetAddress;
                assertEq(diamondLoupeFacet.facetAddress(selector), expected);
            }
        }
    }

    function test_FacetAddressToSelectorsMappingIsCorrect() public view {
        for (uint256 i; i < facetAddresses.length; ++i) {
            bytes4[] memory selectors = diamondLoupeFacet.facetFunctionSelectors(facetAddresses[i]);
            for (uint256 j; j < selectors.length; ++j) {
                assertEq(diamondLoupeFacet.facetAddress(selectors[j]), facetAddresses[i]);
            }
        }
    }

    function test_SupportsERC165() public view {
        assertTrue(diamondLoupeFacet.supportsInterface(type(IERC165).interfaceId)); // ERC165 interface ID
    }

    function test_SupportsERC173() public view {
        assertTrue(diamondLoupeFacet.supportsInterface(0x7f5828d0)); // ERC173 interface ID
    }

    function test_SupportsIDiamondCut() public view {
        assertTrue(diamondLoupeFacet.supportsInterface(type(IDiamondCut).interfaceId)); // IDiamondCut interface ID
    }

    function test_SupportsIDiamondLoupe() public view {
        assertTrue(diamondLoupeFacet.supportsInterface(type(IDiamondLoupe).interfaceId)); // IDiamondLoupe interface ID
    }
}
