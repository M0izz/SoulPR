# SoulPR — Migration from Monad Chain to NEAR Protocol

## Status
The project currently runs on **Monad Testnet** (Chain ID: 10143) via a Solidity
ERC-721 soulbound contract + ethers.js backend. This document describes the
NEAR Protocol implementation added to this codebase so you can migrate.

No existing branch contains a completed NEAR migration. The remote reference
`origin/m0izz-near-backend-adapter` is a stale/deleted pointer with no commits.
All NEAR code below is the new implementation.

## 1. WHAT CHANGES
Monad/EVM               | NEAR Protocol
----------------------- | ---------------
Solidity (SoulPR.sol)   | Rust + near-sdk (contract/near/src/lib.rs)
ethers.js ChainService  | near-api-js NearChainService
0x... hex addresses     | NEAR account ids (alice.testnet)
personal_sign (MetaMask)| near-api-js signMessage (NEAR wallet)
Chain ID 10143          | testnet / rpc.testnet.near.org
Hardhat deployment      | near build / near deploy

Soulbound property      | Enforced by NOT exposing any nft_transfer method


## 2. NEW FILES (NEAR migration)
contract/near/Cargo.toml                 NEAR contract manifest
contract/near/src/lib.rs                 SoulPR soulbound contract (Rust, near-sdk)
backend/src/services/NearChainService.ts NEAR minter service (mint/isMinted/view)
backend/src/services/MintService.ts      Refactored: injects any IChainService
backend/src/routes/wallet.ts             NEAR account-id + signature verification
frontend/src/lib/near.ts                 NearConnector (connect/sign/disconnect)
frontend/src/lib/api.ts                  linkWallet accepts optional publicKey
frontend/src/pages/LinkWallet.tsx        NEAR connect & sign flow (VITE_NEAR_ENABLED)
backend/.env.example                     NEAR env vars + CHAIN_PROVIDER
frontend/.env.example                    NEAR frontend env vars
