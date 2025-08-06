// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Role} from "@chronicle-types/PartyStorage.sol";

event PartyRegistered(address indexed addr, string name, Role role);

event PartyActivated(address indexed addr);

event PartyDeactivated(address indexed addr);
