# hedera-diamond-hts-lib

_Seamless Hedera Token Service (HTS) integration for EIP-2535 Diamond Standard smart contracts._

---

## Overview

**hedera-diamond-hts-lib** solves the challenge of using Hedera's non-EVM HTS precompiles and abstract contracts (like `IHederaTokenService`) within modular, upgradeable Diamond (EIP-2535) architectures. Instead of inheriting abstract contracts (which is incompatible with delegatecall-based facets), this library provides gas-optimized, composable `library` wrappers for all core HTS operations.

These libraries enable facets in a Diamond proxy to perform mint, burn, transfer, associate, dissociate, freeze, KYC, and other token operations directly, using delegatecall-compatible stateless functions. This unlocks full HTS utility in modular, upgradable dApps.

---

## Features

- **Modular HTS Operations:** Each HTS function (mint, burn, transfer, etc.) is available as a standalone library function.
- **Diamond Facet Compatible:** Designed for use inside EIP-2535 facets via delegatecall, with no stateful logic.
- **Full HTS Coverage:** Supports association, dissociation, KYC, freeze, custom fees, NFT and fungible operations, and more.
- **Lightweight & Composable:** No inheritance, minimal overhead, easily composed with other libraries and storage patterns.

---

## Installation

### Prerequisites
- Foundry or hardhat project

### Add to Your Project

#### Option 1: Manual Copy
Copy the `.sol` files from `src/libraries/hts/` into your project's libraries directory.

#### Option 2: forge install
```sh
forge install dadadave80/chronicle
```

---

## Usage Example

Import and use in a facet contract:

```solidity
import {LibHederaTokenService} from "@chronicle/libraries/hts/LibHederaTokenService.sol";

contract ProductsFacet {
    function mintProduct(address token, int64 amount) external {
        // Calls the Hedera Token Service mint via precompile
        (int256 code, int64 newSupply, int64[] memory serials) = LibHederaTokenService.mintToken(token, amount, new bytes[](0));
        require(code == 22, "Mint failed"); // 22 = SUCCESS
    }
}
```

**Best Practices:**
- Use with [LibDiamond](https://eips.ethereum.org/EIPS/eip-2535) storage patterns—never store state in libraries.
- Use `using LibHederaTokenService for address;` for more ergonomic syntax.
- Combine with access control and event logging as needed.

---

## Project Structure

- `LibHederaTokenService.sol` — Core stateless wrappers for all HTS precompile operations (mint, burn, transfer, associate, etc.)
- `LibSafeHTS.sol` — Revert-on-failure safe wrappers for all HTS calls (throws on non-SUCCESS response).
- `LibFeeHelper.sol` — Utilities for constructing custom fee structs for HTS tokens.
- `LibKeyHelper.sol` — Utilities for managing HTS key types and key assignment.

---

## Limitations / Considerations

- **Delegatecall Overhead:** Calls from facets via delegatecall are slightly more expensive than direct contract calls.
- **No Library State:** All logic must be stateless; use Diamond storage patterns for persistent data.
- **HTS Compatibility:** Only works on Hedera-compatible EVM chains with HTS precompiles available at `0x167`.
- **Error Handling:** Use `LibSafeHTS` for automatic revert on failure, or handle response codes manually with `LibHederaTokenService`.

---

## Testing

- **Unit Tests:**
  - Hardhat: `npx hardhat test`
  - Foundry: `forge test`
- **Coverage:**
  - Hardhat: `npx hardhat coverage`
  - Foundry: `forge coverage`

Tests cover all core HTS operations, including edge cases and error handling.

---

## Contributing

- Fork and submit PRs for new HTS methods, optimizations, or bug fixes.
- Adhere to Solidity style guidelines and include unit tests for new features.
- Open issues for feature requests or HTS compatibility questions.

---

## License

MIT

---

## References

- [Hedera Token Service Documentation](https://docs.hedera.com/hedera/smart-contracts/hedera-token-service)
- [EIP-2535 Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535)
- [Hedera Token Service Solidity Interfaces](https://github.com/hashgraph/hedera-smart-contracts)
