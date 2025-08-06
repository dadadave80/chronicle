// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Status, Product} from "@chainsight-types/ProductStorage.sol";

event ProductCreated(address indexed tokenAddress, address indexed owner, Product product);

event ProductTransferred(address indexed tokenAddress, address from, address to, Status status);
