// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

error SupplyChainInactive(address supplyChain);
error NotSupplier(address supplier);
error InvalidTokenAddress();
error NotRetailer(address retailer);
error NotTransporter(address transporter);
error ProductNotOrdered(address productToken);
error ProductNotAssigned(address productToken);
error ProductNotAvailable(address productToken);
error ProductNotBought(address productToken);
