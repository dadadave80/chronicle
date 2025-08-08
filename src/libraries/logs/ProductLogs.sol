// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Product} from "@chronicle-types/ProductStorage.sol";

event ProductCreated(Product indexed product, int64[] serialNumbers);

event ProductUpdated(Product indexed product);

event ProductTransferred(address indexed from, address indexed to, Product indexed product);

event ProductQuantityIncreased(Product indexed product, int64[] serialNumbers);

event ProductQuantityDecreased(Product indexed product, int64[] serialNumbers);
