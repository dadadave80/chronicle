# Chronify: Modular NFT‑Powered Supply Chain on Hedera

> **Chronify is a composable, upgradeable supply chain platform leveraging the Diamond Standard (EIP‑2535) and Hedera Token Service NFTs for end‑to‑end traceability. It provides a transparent and immutable way to track products from origin to destination, ensuring accountability and reducing fraud.
**

---

## Overview

Chronify is a modular smart contract system for supply chain management, built on the Hedera network. It employs the Diamond Standard (EIP‑2535) for upgradeable, facet‑based architecture, allowing seamless extension and maintenance. Core supply chain entities—**parties**, **products**, and **supply chain events**—are managed as distinct facets. The system integrates Hedera Token Service (HTS) to mint and transfer NFTs representing unique products, enabling secure, verifiable, and transparent asset tracking across the supply chain.

By combining modularity, upgradeability, and HTS NFT integration, Chronicle delivers a robust foundation for traceable, compliant, and future‑proof supply chain solutions.

---

## Features

- **Modular Facet Architecture:** Parties, Products, and Supply Chain logic separated into upgradable facets.
- **Diamond Standard (EIP‑2535):** Dynamic addition, replacement, and removal of contract functionality.
- **HTS NFT Integration:** Mint, transfer, and manage NFTs for unique product tracking on Hedera.
- **Access Control:** Role‑based permissions for parties (e.g., Supplier, Transporter, Retailer).
- **Traceability:** End‑to‑end product journey tracking and event logging.
- **Upgradeable & Extensible:** Use DiamondCut to safely upgrade or extend contract logic.
- **Event Logging:** On‑chain logs for party/product registration, transfer, and status changes.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Solidity](https://docs.soliditylang.org/) 0.8+
- [Hedera Token Service SDK](https://github.com/hashgraph/hedera-smart-contracts)
- [Foundry](https://book.getfoundry.sh/) (optional, for advanced EVM tooling)

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/dadadave80/chronicle.git
   cd chronicle
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or yarn
   ```
3. **Configure network:**
   - Update `foundry.toml` or `.env` with your Hedera RPC and credentials.

---

## Project Structure

```text
src/
├── Chronicle.sol                # Diamond proxy root contract
├── facets/
│   ├── PartiesFacet.sol         # Party registration, roles, access control
│   └── ProductsFacet.sol        # Product/NFT management, minting, transfer
├── initializers/
│   └── InitHTCKeyTypes.sol      # Key type initialization for HTS
├── libraries/
│   ├── LibParty.sol             # Party logic, storage, helpers
│   ├── LibProduct.sol           # Product logic, HTS/NFT integration
│   ├── hts/
│   │   ├── LibHederaTokenService.sol # HTS interface, NFT mint/transfer
│   │   └── LibKeyHelper.sol     # Key management for HTS tokens
│   ├── logs/
│   │   ├── PartyLogs.sol        # Events for party actions
│   │   └── ProductLogs.sol      # Events for product actions
│   └── types/                   # Storage structs/enums for parties/products/keys
```

---

## Usage / Workflow

### 1. Register Parties
```solidity
// Register a new party (Supplier, Transporter, Retailer)
PartiesFacet.registerParty("Acme Logistics", Role.Transporter);
```

### 2. Mint Product NFTs
```solidity
// Mint a new product as an NFT
ProductsFacet.addProduct("Widget A", "Batch 001", 100, 10);
```

### 3. Transfer Products
```solidity
// Transfer NFT from supplier to transporter
ProductsFacet.transferProduct(tokenAddress, transporterAddress, serialNumber);
```

### 4. Track Product Status
```solidity
// Update or query product status
ProductsFacet.getProductByTokenAddress(tokenAddress);
ProductsFacet.updateProduct(tokenAddress, "Widget A+", "Batch 001A", 120);
```

---

## Development & Testing

1. **Compile contracts:**
   ```sh
   npx hardhat compile
   # or
   forge build
   ```
2. **Run tests:**
   ```sh
   npx hardhat test
   # or
   forge test
   ```
3. **Upgrade contracts (DiamondCut):**
   - Deploy new facet contract.
   - Call `diamondCut` on the Diamond proxy with facet address and function selectors.
   - See [EIP-2535 DiamondCut documentation](https://eips.ethereum.org/EIPS/eip-2535#diamondcut-function) for details.

---

## Deployed Contracts
- See [Deployed Contracts](./contract-addresses.md)

## Roadmap

- [x] Owner lookup and management
- [ ] Compliance and audit workflows
- [x] UI front-end for supply chain visualization
- [x] Testnet deployment scripts
- [ ] Advanced analytics and reporting

---

## Contributing

We welcome contributions!

- Please use [GitHub Issues](https://github.com/dadadave80/chronicle/issues) for bug reports and feature requests.
- Follow the [Pull Request template](.github/PULL_REQUEST_TEMPLATE.md) for submitting changes.
- Adhere to [Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.20/style-guide.html) and project coding standards.
- Write clear commit messages and document public functions.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgements & References

- [Diamond Standard Template (EIP-2535)](https://github.com/dadadave80/erc2535-diamond-template)
- [Hedera Token Service (HTS) Docs](https://docs.hedera.com/hedera/smart-contracts/hedera-token-service)
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
