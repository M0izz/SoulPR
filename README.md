# ⚡ SoulPR — Proof That Builds You

> **Automated open-source contribution receipts rendered as Soulbound Tokens (SBTs) on the Monad Testnet.**

[![Monad Testnet](https://img.shields.io/badge/Network-Monad%20Testnet-8B5CF6?style=flat-square)](https://testnet-rpc.monad.xyz)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity)](./contract)
[![Express Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-000000?style=flat-square&logo=express)](./backend)
[![Vite Frontend](https://img.shields.io/badge/Frontend-React%20%2F%20TypeScript-61DAFB?style=flat-square&logo=react)](./frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg?style=flat-square)](LICENSE)

---

## 🌟 Overview

**SoulPR** turns every merged GitHub Pull Request into a permanent, non-transferable **Soulbound Token (SBT)** minted directly to the contributor's wallet on the **Monad** network. 

Open-source contributions represent a developer's true track record. SoulPR bridges GitHub activity with Web3 identity by producing tamper-proof, on-chain contribution receipts that are 100% gasless for contributors.

---

## ✨ Key Features

- 🔄 **Automated Webhook Engine**: Listens for GitHub `pull_request.closed` events and verifies merge status in real time.
- ⛽ **Zero Gas Costs for Contributors**: The backend minter wallet covers 100% of blockchain transaction fees. Contributors only sign a free off-chain signature once.
- 🛡️ **Non-Transferable (Soulbound)**: Contract-level enforcement (`_update` override in Solidity) prevents token transfers or sales.
- 🎨 **Holographic 3D SBT Showcase**: Interactive SBT modal featuring counter-rotating glow rings, star twinkling particles, floating hexagon cards, and bottom wave auroras.
- 🌓 **Dynamic Theme Engine**: Seamless toggle between **Orange (Light)** and **Black (Dark)** modes using unified CSS design tokens (`Outfit` & `Inter` typography).
- 🔍 **Contributor Lookup & Repositories**: Verify any wallet address or GitHub handle, search past proofs, and manage tracked organization repositories.

---

## 🏗️ Technical Architecture

```
                                 ┌────────────────────────┐
                                 │   GitHub Repository    │
                                 │  (Merged Pull Request) │
                                 └───────────┬────────────┘
                                             │
                                     Webhook Payload
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                           Backend Service (Node.js/Express)                    │
│                                                                                │
│   ├── 1. Verify GitHub HMAC Signature (SHA-256)                                │
│   ├── 2. Check Tracked Repository Registry                                     │
│   ├── 3. Map GitHub Handle ──► Wallet Address (Database / In-Memory)            │
│   └── 4. Sign & Dispatch Mint Tx via Minter Wallet                             │
└────────────────────────────────────────────┬───────────────────────────────────┘
                                             │
                                  Attestation Transaction
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                         SoulPR Smart Contract (Solidity)                       │
│                                (Monad Testnet)                                 │
│                                                                                │
│   ├── Mint Non-Transferable ERC-721 Token                                      │
│   ├── Emit On-Chain Attestation Event (repo, prNumber, contributor)            │
│   └── Render Dynamic On-Chain SVG Metadata                                     │
└────────────────────────────────────────────┬───────────────────────────────────┘
                                             │
                                    Direct On-Chain Query
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                         Frontend Dashboard (React / Vite)                      │
│                                                                                │
│   ├── Interactive Contributor Overview & Stats                                 │
│   ├── 3D Holographic SBT Modal Display                                         │
│   └── Monad Explorer Verification Links                                        │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
OSS Contributer Recpiet/
├── contract/              # Solidity Smart Contract & Hardhat Tooling
│   ├── contracts/
│   │   └── SoulPR.sol     # Non-transferable ERC-721 Soulbound Contract
│   ├── scripts/
│   │   └── deploy.ts      # Deployment Script for Monad Testnet / Hardhat
│   └── test/              # Comprehensive Smart Contract Unit Tests
│
├── backend/               # Express.js REST API & Minter Service
│   ├── src/
│   │   ├── routes/        # Webhook, Auth, Wallet & Repo Endpoints
│   │   ├── services/      # ChainService, MintService, Database Service
│   │   └── index.ts       # Server Entry Point
│   └── render.yaml        # Production Deployment Config for Render
│
└── frontend/              # React + Vite Web Application
    ├── src/
    │   ├── components/    # BadgeDetailModal, Nav, ThemeToggle, Icons
    │   ├── pages/         # Landing, Dashboard, LinkWallet, Install, HowItWorks
    │   └── index.css      # Core Design System Tokens & Animations
    └── vite.config.ts     # Vite Bundler Setup
```

---

## 🔐 Smart Contract Specifications (`SoulPR.sol`)

- **Standard**: Non-Transferable ERC-721
- **Solidity Version**: `0.8.20`
- **Network**: Monad Testnet (Chain ID: `10143`)
- **Key Functions**:
  - `attest(address to, string memory repo, uint256 prNumber, string memory prTitle)`: Restricted to contract owner / backend minter wallet.
  - `_update(address to, uint256 tokenId, address auth)`: Overridden to revert on transfers, preserving soulbound properties.

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: `v18+` or `v20+`
- **npm**: `v9+`
- **MetaMask** browser extension (connected to Monad Testnet)

---

### 1. Smart Contract (`/contract`)

```bash
cd contract
npm install

# Compile contract
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Monad Testnet
npx hardhat run scripts/deploy.ts --network monadTestnet
```

---

### 2. Backend Service (`/backend`)

Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
CONTRACT_ADDRESS=0xYourDeployedContractAddress
BACKEND_WALLET_PRIVATE_KEY=0xYourBackendPrivateKey
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SESSION_SECRET=your_random_session_secret
```

Start backend server:
```bash
cd backend
npm install
npm run dev
```

---

### 3. Frontend Dashboard (`/frontend`)

Create `frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:3001
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Start frontend server:
```bash
cd frontend
npm install
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<p center align="center">
Made with ❤️ for open-source contributors on <b>Monad</b>.
</p>
