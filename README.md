# SoulPR

Automatically converts merged GitHub pull requests into permanent, wallet-bound, soulbound proof of contribution (SBT) on Monad testnet.

## The Design: Forge Theme

The interface utilizes the **Forge Theme**, inspired by the physical metal-casting process:
- **Default (Forge)**: Warm dark iron paper (`#1B1815`), cooled slag cards, and a singular hot ember accent (`#FF6A1A`) used strictly for cryptographic stamps.
- **Opt-in (Ledger)**: Alternating pale-sage rows and ruled borders for recruiters wanting a paper-like lookup page.
- **Typefaces**: Oswald (condensed industrial headlines) and JetBrains Mono (cryptographic data).

---

## Technical Architecture

```
GitHub (PR merged webhook)
   │
   ▼
Backend Webhook Listener (Node.js/Express)
   │
   ├── HMAC Signature Verification
   ├── Check Tracked Repos (Firestore/In-Memory)
   │
   ├── [No Wallet Linked] ──► Queue in pendingMints
   │
   └── [Wallet Linked] ─────► Attestation Contract (Solidity / Monad testnet)
                                 │
                                 ▼
Dashboard Lookup ◄─────────── Direct reads (ethers.js / tokensByOwner)
```

---

## Disclosed Limitations & Trust Model

1. **Mint Authority**: The contract restricts `attest()` to the `backendMinter` address. This single point of trust is disclosed and intended for the MVP. Future roadmaps replace this with a decentralized oracle or validator multi-sig.
2. **On-chain Timestamps**: To minimize contract complexity and gas, the merge timestamp is stored and rendered inside the on-chain SVG as a raw Unix timestamp (e.g. `1752300000`). The dashboard frontend formats this into a human-readable date.
3. **Gas Model**: Contributors only sign a free cryptographic message to link their wallet. **The backend covers 100% of the gas cost** for writing the attestation to the blockchain.

---

## Setup & Running

### Prerequisites
- Node.js (v18+)
- npm

### 1. Smart Contract (`/contract`)
1. Create a `contract/.env` using `contract/.env.example`.
2. Install dependencies:
   ```bash
   cd contract
   npm install
   ```
3. Compile contract:
   ```bash
   npx hardhat compile
   ```
4. Run tests:
   ```bash
   npx hardhat test
   ```
5. Deploy (local or Monad testnet):
   ```bash
   npx hardhat run scripts/deploy.ts --network hardhat
   ```

### 2. Backend Service (`/backend`)
1. Create `backend/.env` based on `backend/.env.example`.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Run tests (unit and integration tests):
   ```bash
   npm test
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```
*Note: If `FIREBASE_SERVICE_ACCOUNT_JSON` is empty, the server automatically defaults to a robust in-memory database to allow instant local testing.*

### 3. Frontend Dashboard (`/frontend`)
1. Copy the deployed contract address into `frontend/.env`.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start frontend dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.
