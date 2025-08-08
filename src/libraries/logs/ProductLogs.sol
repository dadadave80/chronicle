// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Product} from "@chronicle-types/ProductStorage.sol";
import {SupplyChainStatus} from "@chronicle-types/SupplyChainStorage.sol";

event ProductCreated(Product indexed product);

event ProductUpdated(Product indexed product);

event ProductTransferred(address indexed from, address indexed to, Product indexed product);

event ProductQuantityIncreased(Product indexed product);

event ProductQuantityDecreased(Product indexed product);

event ProductOrdered(address indexed retailer, address indexed product, int64 quantity);

event ProductAssigned(address indexed transporter, address indexed product, int64 quantity);

event ProductStatusUpdated(address indexed transporter, address indexed product, SupplyChainStatus status);

event ProductFulfilled(address indexed transporter, address indexed product, int64 quantity);

event ProductBought(address indexed retailer, address indexed product, int64 quantity);
