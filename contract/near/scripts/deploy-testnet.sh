#!/usr/bin/env bash
set -euo pipefail

: "${NEAR_CONTRACT_ID:?Set NEAR_CONTRACT_ID}"
: "${NEAR_OWNER_ID:?Set NEAR_OWNER_ID}"
: "${NEAR_BACKEND_ACCOUNT_ID:?Set NEAR_BACKEND_ACCOUNT_ID}"

cargo build --manifest-path near/Cargo.toml --target wasm32-unknown-unknown --release
near deploy \
  --accountId "$NEAR_CONTRACT_ID" \
  --wasmFile near/target/wasm32-unknown-unknown/release/soulpr_near.wasm
near call "$NEAR_CONTRACT_ID" init \
  "{\"owner\":\"$NEAR_OWNER_ID\",\"backend_minter\":\"$NEAR_BACKEND_ACCOUNT_ID\"}" \
  --accountId "$NEAR_CONTRACT_ID" \
  --networkId testnet