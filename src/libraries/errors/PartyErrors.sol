// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Role} from "@chronicle-types/PartyStorage.sol";

error PartyInactive(address party);
error PartyAlreadyExists(address party);
error RoleNotFound(Role role);
error RoleAlreadyExists(Role role);
error PartyNotActive(address party);
error PartyFrozen(address party);
error PartyNotFrozen(address party);
error PartyNotSupplier(address party);
error PartyNotTransporter(address party);
error PartyNotRetailer(address party);
