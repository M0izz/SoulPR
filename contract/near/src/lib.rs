use near_sdk::{
    env, near_bindgen, AccountId, PanicOnDefault, BorshStorageKey,
    serde::{Serialize, Deserialize},
};
use near_sdk::collections::{LookupMap, UnorderedMap, Vector};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

/**
 * SoulPR — NEAR Protocol migration
 *
 * Soulbound (non-transferable) contribution attestation contract on NEAR.
 * Each merged GitHub PR becomes one non-transferable token minted to a
 * contributor's NEAR account id by the authorized backend minter.
 *
 * Design notes vs. the Monad Solidity version:
 *  - Identifiers are NEAR account ids (e.g. soulpr.testnet), not hex addresses.
 *  - There is no EVM / no ethers.js. Clients use near-api-js.
 *  - Idempotency uses sha256 (env::sha256) instead of keccak256.
 *  - Soulbound by construction: no nft_transfer method is exposed, so tokens
 *    cannot be transferred.
 */

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct SoulPR {
    /// Contract deployer — authorized to rotate the backend minter.
    owner: AccountId,
    /// Backend minter account id — the only account allowed to mint attestations.
    backend_minter: AccountId,
    /// Monotonically increasing token id counter (starts at 1).
    next_token_id: u64,
    /// Idempotency guard: sha256(repo || pr_number || contributor || merge_commit_sha) -> token_id
    minted: LookupMap<Vec<u8>, u64>,
    /// token_id -> attestation record
    attestations: UnorderedMap<u64, Attestation>,
    /// owner account id -> vector of owned token ids (for dashboard reads)
    tokens_by_owner: LookupMap<AccountId, Vector<u64>>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Attestation {
    pub contributor: AccountId,
    pub repo: String,            // "owner/name"
    pub pr_number: u64,
    pub pr_title: String,
    pub github_username: String,
    pub merge_commit_sha: String,
    pub merge_timestamp: u64,    // Unix seconds
}

#[derive(BorshStorageKey)]
enum StorageKey {
    Minted,
    Attestations,
    TokensByOwner,
    TokensByOwnerInner { account_id_hash: Vec<u8> },
}

#[near_bindgen]
impl SoulPR {
    #[init]
    pub fn init(owner: AccountId, backend_minter: AccountId) -> Self {
        assert!(!owner.as_str().is_empty(), "ERR_ZERO_OWNER");
        assert!(!backend_minter.as_str().is_empty(), "ERR_ZERO_MINTER");
        Self {
            owner,
            backend_minter,
            next_token_id: 1,
            minted: LookupMap::new(StorageKey::Minted),
            attestations: UnorderedMap::new(StorageKey::Attestations),
            tokens_by_owner: LookupMap::new(StorageKey::TokensByOwner),
        }
    }

    /// Idempotency key = sha256(repo || pr_number(le) || contributor || merge_commit_sha)
    fn compute_key(
        repo: &str,
        pr_number: u64,
        contributor: &AccountId,
        merge_commit_sha: &str,
    ) -> Vec<u8> {
        let mut b = Vec::new();
        b.extend_from_slice(repo.as_bytes());
        b.extend_from_slice(&pr_number.to_le_bytes());
        b.extend_from_slice(contributor.as_bytes());
        b.extend_from_slice(merge_commit_sha.as_bytes());
        env::sha256(&b)
    }

    /// Mint a soulbound contribution receipt. Callable only by backend_minter.
    /// Returns the assigned token id.
    pub fn mint(
        &mut self,
        contributor: AccountId,
        repo: String,
        pr_number: u64,
        pr_title: String,
        github_username: String,
        merge_commit_sha: String,
        merge_timestamp: u64,
    ) -> u64 {
        assert_eq!(
            env::predecessor_account_id(),
            self.backend_minter,
            "ERR_NOT_BACKEND_MINTER"
        );

        let key = Self::compute_key(&repo, pr_number, &contributor, &merge_commit_sha);
        assert!(!self.minted.contains_key(&key), "ERR_ALREADY_ATTESTED");

        let token_id = self.next_token_id;
        self.next_token_id += 1;

        let attestation = Attestation {
            contributor: contributor.clone(),
            repo: repo.clone(),
            pr_number,
            pr_title,
            github_username,
            merge_commit_sha,
            merge_timestamp,
        };

        self.minted.insert(&key, &token_id);
        self.attestations.insert(&token_id, &attestation);

        let mut tokens = self
            .tokens_by_owner
            .get(&contributor)
            .unwrap_or_else(|| {
                Vector::new(StorageKey::TokensByOwnerInner {
                    account_id_hash: env::sha256(contributor.as_bytes()),
                })
            });
        tokens.push(&token_id);
        self.tokens_by_owner.insert(&contributor, &tokens);

        token_id
    }

    /// Idempotency check: true if this (repo, pr_number, contributor, merge_commit_sha)
    /// was already attested on-chain.
    pub fn is_minted(
        &self,
        repo: String,
        pr_number: u64,
        contributor: AccountId,
        merge_commit_sha: String,
    ) -> bool {
        let key = Self::compute_key(&repo, pr_number, &contributor, &merge_commit_sha);
        self.minted.contains_key(&key)
    }

    /// Read the attestation record for a token id.
    pub fn nft_token(&self, token_id: u64) -> Option<Attestation> {
        self.attestations.get(&token_id)
    }

    /// Token ids owned by a NEAR account (empty vec if none).
    pub fn nft_tokens_by_owner(&self, owner: AccountId) -> Vec<u64> {
        self.tokens_by_owner
            .get(&owner)
            .map(|v| v.to_vec())
            .unwrap_or_default()
    }

    /// Total number of attestation tokens minted.
    pub fn nft_total_supply(&self) -> u64 {
        self.next_token_id.saturating_sub(1)
    }

    /// Admin: rotate the backend minter (owner only).
    pub fn set_backend_minter(&mut self, new_minter: AccountId) {
        assert_eq!(env::predecessor_account_id(), self.owner, "ERR_NOT_OWNER");
        assert!(!new_minter.as_str().is_empty(), "ERR_ZERO_MINTER");
        self.backend_minter = new_minter;
    }

}
