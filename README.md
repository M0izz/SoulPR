# S I G N E T (formerly SoulPR) — Evidence-First Contribution Credentials

> **Your work is your mark. Turn eligible merged open-source contributions into permanent, verifiable Soulbound credentials on NEAR Protocol.**

[![NEAR Protocol](https://img.shields.io/badge/NEAR-Protocol%20Testnet-00C08B?style=flat-square&logo=near)](https://testnet.nearblocks.io)
[![Rust](https://img.shields.io/badge/Smart%20Contract-Rust%20%2F%20near--sdk%20v5-DEA584?style=flat-square&logo=rust)](./contract/near)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-000000?style=flat-square&logo=express)](./backend)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2F%20TypeScript%20%2F%20Vite-61DAFB?style=flat-square&logo=react)](./frontend)
[![License: Proprietary](https://img.shields.io/badge/License-All%20Rights%20Reserved-B9572B.svg?style=flat-square)](LICENSE)

**Live Deployed Application**: [https://soul-pr-git-main-moizzs-projects.vercel.app/](https://soul-pr-git-main-moizzs-projects.vercel.app/)

---

## 1. Overview

**SIGNET** is an evidence-first contribution credential system for individual open-source developers. Its mission is to transform eligible, merged GitHub pull requests into structured, auditable contribution records and non-transferable (soulbound) on-chain credentials on **NEAR Protocol**.

SIGNET is not an NFT marketplace, a badge game, or a subjective code scorer. It operates on a disciplined chain of custody:
$$\text{GitHub Source Facts} \longrightarrow \text{Evidence Snapshot (SHA-256)} \longrightarrow \text{Deterministic Assessment} \longrightarrow \text{Developer Approval} \longrightarrow \text{NEAR Transaction} \longrightarrow \text{Public Verification}$$

### Product Principles
- **Evidence First**: All claims link directly to authoritative GitHub merge facts, immutable content digests, and canonical contract records.
- **Developer Agency**: No credential is ever issued without explicit developer evidence review and NEAR wallet signing authorization.
- **Verifiable Records**: Anyone can inspect and verify a credential independently without requiring a SIGNET account.
- **Truthful States**: Unconfirmed, pending, or sample items are never represented as issued credentials.

---

## 2. Technical Architecture

```
                                 ┌────────────────────────┐
                                 │   GitHub Repository    │
                                 │  (Merged Pull Request) │
                                 └───────────┬────────────┘
                                             │
                             Webhook Event or Manual PR URL Import
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                         Backend Service (Node.js / Express)                    │
│                                                                                │
│   ├── 1. Ingestion: Extract canonical PR facts, author ID, & commit SHA       │
│   ├── 2. Evidence Snapshot: Canonicalize & compute SHA-256 content digest      │
│   ├── 3. Deterministic Assessment: Rule-by-rule eligibility engine             │
│   ├── 4. Developer Approval: Record auditable approval bound to snapshot hash  │
│   └── 5. NearChainService: Dispatch & monitor NEAR Protocol transaction        │
└────────────────────────────┬───────────────────────────────────┘
                                             │
                             near-api-js / Function Call
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                      NEAR Protocol Smart Contract (Rust)                       │
│                                (NEAR Testnet)                                  │
│                                                                                │
│   ├── Soulbound Token: Non-transferable contribution attestation record        │
│   ├── Idempotency Guard: sha256(repo || prNumber || contributor || commitSha)  │
│   ├── Enumeration Views: nft_token, nft_tokens_by_owner, nft_total_supply      │
│   └── Verification State: Immutable receipt anchored to evidence digest        │
└────────────────────────────┬───────────────────────────────────┘
                                             │
                               Direct NEAR RPC Query
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                   Frontend Workspace & Registry (React / Vite)                 │
│                                                                                │
│   ├── Overview (/dashboard): Personal headquarters & truthful metrics          │
│   ├── Contributions (/contributions): Structured registry & PR import          │
│   ├── Evidence Dossier (/contributions/:id): Rule breakdown & approval action │
│   ├── My Credentials (/credentials): Soulbound credential records shelf        │
│   ├── Verification (/verification): Public lookup & 4-layer inspector         │
│   └── Settings (/settings): GitHub scopes, NEAR account, and privacy controls  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Information Architecture & Workspaces

The application is structured into an authenticated developer workspace and dedicated public verification routes:

| Route | Purpose | Access |
| :--- | :--- | :--- |
| **`/`** | Product landing page & brand philosophy | Public |
| **`/dashboard`** | Personal Contribution Headquarters & next actions | Authenticated |
| **`/contributions`** | Structured contributions registry with filters & manual import | Authenticated |
| **`/contributions/:id`** | Comprehensive evidence dossier & developer review approval | Authenticated |
| **`/credentials`** | Issued and pending on-chain credentials shelf | Authenticated |
| **`/verification`** | Public credential lookup & 4-layer verification entry | Public |
| **`/verify/:credentialId`** | Live verification page linking source facts & NEAR Explorer | Public |
| **`/verify/sample`** | Illustrative sample credential showcase | Public |
| **`/settings`** | GitHub permissions, NEAR account link, sync preferences | Authenticated |

---

## 4. Repository Structure

```
SoulPR/
├── contract/
│   └── near/                 # Native NEAR Protocol Smart Contract (Rust)
│       ├── Cargo.toml        # Rust manifest (near-sdk v5)
│       ├── src/
│       │   ├── lib.rs        # Soulbound SoulPR contract & view methods
│       │   └── signet_schema.rs # Structured credential & identity hashing
│       └── tests/
│           └── lib.rs        # Integration test suite
│
├── backend/                  # Node.js / Express API & Verification Service
│   ├── src/
│   │   ├── routes/           # Webhook, Auth, Wallet, & Repos endpoints
│   │   ├── services/         # NearChainService, MintService, DbService
│   │   └── index.ts          # Server entry point & CORS middleware
│   └── render.yaml           # Deployment blueprint for Render
│
└── frontend/                 # React 18 + Vite Workspace Application
    ├── src/
    │   ├── components/       # WorkspaceLayout, BrandLockup, CredentialSeal
    │   ├── context/          # WorkspaceContext for session & sync state
    │   ├── pages/            # Landing, Auth, VerifyLive, VerifySample
    │   │   └── workspace/    # Overview, Contributions, Dossier, Credentials, Settings
    │   └── lib/              # near.ts (NearConnector), api.ts, github.ts
    └── vite.config.ts        # Vite configuration
```

---

## 5. Smart Contract Specifications (`contract/near`)

- **Language / Framework**: Rust 2021 with `near-sdk v5.7.0`
- **Target Network**: NEAR Protocol Testnet (`testnet`)
- **Compilation Target**: `wasm32-unknown-unknown`
- **Core Functions**:
  - `init(owner: AccountId, backend_minter: AccountId)`: Initializes the contract with an administrative owner and authorized minter.
  - `mint(contributor, repo, pr_number, pr_title, github_username, merge_commit_sha, merge_timestamp)`: Mints a non-transferable contribution receipt. Guarded by an idempotency key: `sha256(repo || pr_number || contributor || merge_commit_sha)`.
  - `is_minted(repo, pr_number, contributor, merge_commit_sha) -> bool`: Checks whether a contribution has already been recorded on-chain.
  - `nft_token(token_id: u64) -> Option<Attestation>`: Reads full attestation metadata for a given token ID.
  - `nft_tokens_by_owner(owner: AccountId) -> Vec<u64>`: Returns all token IDs owned by a specific NEAR account.
  - `nft_total_supply() -> u64`: Total minted attestations.

---

## 6. Local Development Setup

### Prerequisites
- **Node.js**: `>= 22.16.0`
- **Rust & Cargo**: Stable toolchain with `wasm32-unknown-unknown` target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- **NEAR Account**: A valid testnet account from [MyNearWallet](https://testnet.mynearwallet.com/) or [Meteor Wallet](https://wallet.meteorwallet.app/).

---

### Step 1: Rust Smart Contract (`contract/near`)

```bash
cd contract/near

# Verify formatting
cargo fmt -- --check

# Run test suite
cargo test

# Build release WebAssembly artifact
cargo build --target wasm32-unknown-unknown --release
```

---

### Step 2: Backend Service (`backend`)

1. Copy `.env.example` to `backend/.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Configure environment variables in `backend/.env`:
   ```env
   PORT=3001
   NODE_ENV=development
   CHAIN_PROVIDER=near

   SESSION_SECRET=your_32_character_random_session_secret
   FRONTEND_URL=http://localhost:5173

   # GitHub OAuth credentials
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_REDIRECT_URI=http://localhost:3001/auth/github/callback
   GITHUB_WEBHOOK_SECRET=your_webhook_secret

   # NEAR Protocol Testnet Configuration
   NEAR_NODE_URL=https://rpc.testnet.near.org
   NEAR_NETWORK_ID=testnet
   NEAR_CONTRACT_ID=soulpr.testnet
   NEAR_BACKEND_ACCOUNT_ID=soulpr-backend.testnet
   NEAR_BACKEND_PRIVATE_KEY=ed25519:your_backend_private_key_base58
   NEAR_MINT_STORAGE_DEPOSIT=1250000000000000000000
   ```

3. Install dependencies, build, and start the development server:
   ```bash
   npm install
   npm run build
   npm test
   npm run dev
   ```

---

### Step 3: Frontend Workspace (`frontend`)

1. Copy `.env.example` to `frontend/.env`:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Configure variables in `frontend/.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:3001
   VITE_NEAR_ENABLED=true
   VITE_NEAR_NETWORK_ID=testnet
   VITE_NEAR_NODE_URL=https://rpc.testnet.near.org
   VITE_NEAR_CONTRACT_ID=soulpr.testnet
   ```

3. Run the development server:
   ```bash
   npm install
   npm run dev
   ```

4. Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 7. Verification & Telemetry

Every credential issued by SIGNET can be independently audited via:
1. **Canonical Public Verification URL**: `https://soul-pr-git-main-moizzs-projects.vercel.app/verify/:credentialId`
2. **NEAR Explorer**: `https://testnet.nearblocks.io/txns/:txHash`
3. **GitHub Pull Request**: Direct cross-reference to the merged commit SHA on GitHub.

---

## 8. License & Rights

Copyright (c) 2026 SIGNET / SoulPR. **All Rights Reserved.**

This repository and its source code are proprietary and confidential. Unauthorized copying, modification, distribution, sublicensing, or commercial deployment is strictly prohibited. See [LICENSE](LICENSE) for full legal terms.
