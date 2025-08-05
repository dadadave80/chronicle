// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Status} from "@chainsight-types/ProductStorage.sol";

event ProductCreated(address indexed tokenAddress, address indexed owner);

event ProductTransferred(address indexed tokenAddress, address from, address to, Status status);
