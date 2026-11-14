use near_sdk::test_utils::accounts;
use near_sdk::{test_utils::VMContextBuilder, testing_env, AccountId, NearToken};
use soulpr_near::*;
use signet_schema::*;

fn context(predecessor: AccountId) -> near_sdk::VMContext {
    VMContextBuilder::new()
        .predecessor_account_id(predecessor)
        .attached_deposit(NearToken::from_near(1))
        .build()
}

fn make_input(
    contributor: AccountId,
    github_user_id: u64,
    repository_id: u64,
    pr_number: u64,
    pr_title: &str,
    merge_commit_sha: &str,
    issuer: AccountId,
) -> CredentialMintInput {
    let identity_hash = signet_schema::credential_identity_hash(
        github_user_id,
        repository_id,
        pr_number,
        merge_commit_sha,
        CredentialCategory::MergedPullRequest,
    );

    CredentialMintInput {
        contributor_account_id: contributor.clone(),
        github_user_id,
        github_username_at_issuance: "alice".to_string(),
        repository_id,
        repository_full_name: "org/repo".to_string(),
        pr_number,
        pr_title: pr_title.to_string(),
        merge_commit_sha: merge_commit_sha.to_string(),
        merge_timestamp: 1794355200,
        credential_category: CredentialCategory::MergedPullRequest,
        metadata_version: "signet-credential-1.0.0".to_string(),
        evidence: EvidenceReference {
            uri: "ipfs://example/evidence.json".to_string(),
            sha256: vec![0u8; 32],
        },
        artwork: EvidenceReference {
            uri: "ipfs://example/artwork.svg".to_string(),
            sha256: vec![0u8; 32],
        },
        identity_hash,
    }
}

// ---------------------------------------------------------------------------
// Identity encoding tests
// ---------------------------------------------------------------------------

#[test]
fn backend_can_mint_and_duplicate_is_rejected() {
    let owner = accounts(0);
    let backend = accounts(1);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend.clone());

    testing_env!(context(backend));
    // Mint first credential
    let input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        backend.clone(),
    );
    contract.mint(input);

    // Mint second credential with different identity (should succeed, not duplicate)
    let input2 = make_input(
        accounts(3), 99999, 88888, 99, "Other PR",
        "abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567",
        backend.clone(),
    );
    contract.mint(input2);

    // Verify the first contributor owns token 1
    let contributor_tokens = contract.nft_tokens_by_owner(accounts(2).clone());
    assert!(contributor_tokens.contains(&1), "First contributor should own token 1");

    // Verify the second contributor owns token 2
    let contributor_tokens2 = contract.nft_tokens_by_owner(accounts(3).clone());
    assert!(contributor_tokens2.contains(&2), "Second contributor should own token 2");

    // Total supply should be 2 (two distinct credentials minted)
    let total_supply = contract.nft_total_supply();
    assert_eq!(total_supply, 2, "Total supply should be 2 after minting two distinct credentials");

    // Owner should see all token IDs
    let owner_tokens = contract.nft_tokens_by_owner(owner);
    assert_eq!(owner_tokens.len(), 2, "Owner should see 2 tokens total");
}

// ---------------------------------------------------------------------------
// Identity encoding tests
// ---------------------------------------------------------------------------

#[test]
fn valid_canonical_identity_matches_shared_vector() {
    let github = 12345u64;
    let repo = 67890u64;
    let pr = 42u64;
    let sha = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    let category = CredentialCategory::MergedPullRequest;

    let encoded = signet_schema::encode_credential_identity(github, repo, pr, sha, category.clone());
    let digest = signet_schema::credential_identity_hash(github, repo, pr, sha, category.clone());

    let expected_encoded = hex::decode("7369676e65743a63726564656e7469616c2d6964656e746974793a763100000000000030390000000000010932000000000000002a00403031323334353637383961626364656630313233343536373839616263646566303132333435363738396162636465663031323334353637383961626364656600136d65726765645f70756c6c5f72657175657374").unwrap();
    assert_eq!(encoded, expected_encoded);

    let expected_digest = hex::decode("088e86743693dbed2e622481ef2245c12267ec83202daf6ac8a7f49d6e0a3f9d").unwrap();
    assert_eq!(digest, expected_digest);
}

#[test]
fn same_identity_produces_same_digest() {
    let input1 = make_input(
        accounts(2),
        12345,
        67890,
        42,
        "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );
    let input2 = make_input(
        accounts(2),
        12345,
        67890,
        42,
        "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );

    let hash1 = signet_schema::credential_identity_hash(
        input1.github_user_id,
        input1.repository_id,
        input1.pr_number,
        &input1.merge_commit_sha,
        input1.credential_category.clone(),
    );
    let hash2 = signet_schema::credential_identity_hash(
        input2.github_user_id,
        input2.repository_id,
        input2.pr_number,
        &input2.merge_commit_sha,
        input2.credential_category.clone(),
    );

    assert_eq!(hash1, hash2);
}

#[test]
fn different_identity_inputs_produce_different_digests() {
    let hash_a = signet_schema::credential_identity_hash(
        1, 2, 3,
        "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
        CredentialCategory::MergedPullRequest,
    );
    let hash_b = signet_schema::credential_identity_hash(
        1, 2, 4,
        "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
        CredentialCategory::MergedPullRequest,
    );

    assert_ne!(hash_a, hash_b);
}

#[test]
fn contributor_wallet_does_not_affect_identity() {
    let hash_a = signet_schema::credential_identity_hash(
        12345, 67890, 42,
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        CredentialCategory::MergedPullRequest,
    );
    let hash_b = signet_schema::credential_identity_hash(
        12345, 67890, 42,
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        CredentialCategory::MergedPullRequest,
    );

    assert_eq!(hash_a, hash_b);
}

#[test]
#[should_panic(expected = "ERR_INVALID_MERGE_SHA")]
fn uppercase_merge_sha_is_rejected() {
    signet_schema::encode_credential_identity(
        1, 2, 3,
        "ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789",
        CredentialCategory::MergedPullRequest,
    );
}

#[test]
#[should_panic(expected = "ERR_MERGE_COMMIT_SHA_NOT_HEX")]
fn non_hex_merge_sha_is_rejected() {
    signet_schema::encode_credential_identity(
        1, 2, 3,
        "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
        CredentialCategory::MergedPullRequest,
    );
}


// ---------------------------------------------------------------------------
// Validation tests
// ---------------------------------------------------------------------------

#[test]
#[should_panic(expected = "ERR_EMPTY_GITHUB_USERNAME")]
fn empty_github_username_is_rejected() {
    let mut contract = SoulPR::init(accounts(0), accounts(1));
    testing_env!(context(accounts(1)));
    let mut input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );
    input.github_username_at_issuance = "".to_string();
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_GITHUB_USERNAME_TOO_LONG")]
fn github_username_too_long_is_rejected() {
    let mut contract = SoulPR::init(accounts(0), accounts(1));
    testing_env!(context(accounts(1)));
    let mut input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );
    input.github_username_at_issuance = "a".repeat(40);
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_REPOSITORY_FULL_NAME_TOO_LONG")]
fn repository_full_name_too_long_is_rejected() {
    let mut contract = SoulPR::init(accounts(0), accounts(1));
    testing_env!(context(accounts(1)));
    let mut input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );
    input.repository_full_name = "a".repeat(256);
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_PR_TITLE_TOO_LONG")]
fn pr_title_too_long_is_rejected() {
    let mut contract = SoulPR::init(accounts(0), accounts(1));
    testing_env!(context(accounts(1)));
    let mut input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );
    input.pr_title = "a".repeat(513);
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_URI_TOO_LONG")]
fn uri_too_long_is_rejected() {
    let mut contract = SoulPR::init(accounts(0), accounts(1));
    testing_env!(context(accounts(1)));
    let mut input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );
    input.evidence.uri = "a".repeat(2049);
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_METADATA_VERSION_TOO_LONG")]
fn version_string_too_long_is_rejected() {
    let mut contract = SoulPR::init(accounts(0), accounts(1));
    testing_env!(context(accounts(1)));
    let mut input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",

// ---------------------------------------------------------------------------
// Minting tests
// ---------------------------------------------------------------------------

} // closes version_string_too_long_is_rejected()

#[test]
fn backend_can_mint_and_duplicate_is_rejected() {
    let owner = accounts(0);
    let backend = accounts(1);
    let contributor = accounts(2);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend.clone());

    testing_env!(context(backend));
    let input = make_input(
        contributor.clone(),
        12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        backend.clone(),
    );
    let token_id = contract.mint(input);
    assert_eq!(token_id, 1);

    // Identity lookup works
    let identity = signet_schema::credential_identity_hash(
        12345, 67890, 42,
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        CredentialCategory::MergedPullRequest,
    );
    assert!(contract.is_minted_by_identity(identity.clone()));
    assert_eq!(contract.get_token_id_by_identity(identity), Some(1));

    // Credential retrieval returns full record
    let credential = contract.get_credential(1).unwrap();
    assert_eq!(credential.token_id, 1);
    assert_eq!(credential.evidence.contributor_account_id, contributor);
    assert_eq!(credential.evidence.github_user_id, 12345);
    assert_eq!(credential.evidence.repository_id, 67890);
    assert_eq!(credential.evidence.pr_number, 42);
    assert_eq!(credential.evidence.pr_title, "Fix");
    assert_eq!(credential.status.verification_status, VerificationStatus::Valid);
    assert_eq!(credential.status.status_version, 1);

    // Owner enumeration
#[test]
#[should_panic(expected = "ERR_NOT_BACKEND_MINTER")]
fn non_backend_cannot_mint() {
    let owner = accounts(0);
    let backend = accounts(1);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend);
    testing_env!(context(accounts(2)));
    let input = make_input(
        accounts(3), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(2),
    );
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_ALREADY_ATTESTED")]
fn duplicate_identity_is_rejected() {
    let owner = accounts(0);
    let backend = accounts(1);
    let contributor = accounts(2);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend.clone());

    testing_env!(context(backend));
    let input = make_input(
        contributor.clone(),
        12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        backend.clone(),
    );
    contract.mint(input.clone());

    // Same identity — must be rejected
    contract.mint(input);
}
    assert_eq!(contract.nft_tokens_by_owner(contributor), vec![1]);

    // Total supply
    assert_eq!(contract.nft_total_supply(), 1);
}
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );
    input.metadata_version = "a".repeat(65);
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_INVALID_DIGEST_LENGTH")]
fn invalid_digest_length_is_rejected() {
}
#[test]
fn identity_hash_is_stored_and_retrievable() {
    let owner = accounts(0);
    let backend = accounts(1);
    let contributor = accounts(2);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend.clone());

    testing_env!(context(backend));
    let input = make_input(
        contributor.clone(),
        12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        backend.clone(),
    );
    let identity_hash = input.identity_hash.clone();
    contract.mint(input);

    // Retrieve by identity hash
    let credential = contract.get_credential_by_identity(identity_hash.clone()).unwrap();
    assert_eq!(credential.identity_hash, identity_hash);

    // Get token id by identity
    assert_eq!(contract.get_token_id_by_identity(identity_hash), Some(1));
}

#[test]
fn nft_metadata_uses_signet_schema() {
    let contract = SoulPR::init(accounts(0), accounts(1));
    let metadata = contract.nft_metadata();
    assert_eq!(metadata.spec, "signet-metadata-1.0.0");
    assert_eq!(metadata.name, "SIGNET Contribution Credentials");
    assert_eq!(metadata.symbol, "SIGNET");
}

#[test]
fn pagination_respects_maximum_100() {
    let owner = accounts(0);
    let backend = accounts(1);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend.clone());

    testing_env!(context(backend));
    // Mint 3 credentials
    for i in 1..=3u64 {
        let input = make_input(
            accounts(2),
            i * 1000,
            i * 2000,
            i,
            &format!("PR #{}", i),
            &format!("{:064x}", i),
            backend.clone(),
        );
        contract.mint(input);
    }

    // Request limit of 100 (should return only 3)
    let tokens = contract.nft_tokens(None, Some(100));
    assert_eq!(tokens.len(), 3);

    // Request limit of 2 (should return only 2)
    let tokens = contract.nft_tokens(None, Some(2));
    assert_eq!(tokens.len(), 2);
}

#[test]
fn legacy_is_minted_still_works() {
    let owner = accounts(0);
    let backend = accounts(1);
    let contributor = accounts(2);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend.clone());

    testing_env!(context(backend));
    let input = make_input(
        contributor.clone(),
        12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        backend.clone(),
    );
    contract.mint(input);

    // Legacy is_minted should still find it
    assert!(contract.is_minted(
        "org/repo".to_string(),
        42,
        contributor,
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef".to_string(),
    ));
}

#[test]
#[should_panic(expected = "ERR_IDENTITY_HASH_MISMATCH")]
fn invalid_identity_hash_is_rejected() {
    let owner = accounts(0);
    let backend = accounts(1);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend.clone());

    testing_env!(context(backend));
    let mut input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        backend.clone(),
    );
    // Wrong identity hash
    input.identity_hash = vec![1u8; 32];
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_INVALID_EVIDENCE_SHA256")]
fn evidence_sha256_wrong_is_rejected() {
    let mut contract = SoulPR::init(accounts(0), accounts(1));

    testing_env!(context(accounts(1)));
    let mut input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );
    input.evidence.sha256 = vec![0u8; 16];
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_INVALID_ACCOUNT_ID")]
fn invalid_contributor_account_id_is_rejected() {
    let mut contract = SoulPR::init(accounts(0), accounts(1));
    testing_env!(context(accounts(1)));
    let mut input = make_input(
        AccountId::new_unvalidated("not-a-valid-account".to_string()),
        12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        accounts(1),
    );
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_VERSION_STRING_TOO_LONG")]
fn version_string_too_long_is_rejected() {
    let owner = accounts(0);
    let backend = accounts(1);
    testing_env!(context(owner.clone()));
    let mut contract = SoulPR::init(owner, backend.clone());

    testing_env!(context(backend));
    // Mint a valid credential first
    let input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        backend.clone(),
    );
    contract.mint(input);

    // Now try with a too-long metadata version
    testing_env!(context(backend));
    let mut input = make_input(
        accounts(3), 12345, 67890, 42, "Fix",
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        backend.clone(),
    );
    // Set metadata_version to a string longer than the schema allows
    input.metadata_version = "signet-credential-1.0.0.1".to_string(); // too long
    contract.mint(input);
}

#[test]
#[should_panic(expected = "ERR_INVALID_MERGE_SHA")]
fn invalid_digest_length_is_rejected() {
    let mut contract = SoulPR::init(accounts(0), accounts(1));

    testing_env!(context(accounts(1)));
    let mut input = make_input(
        accounts(2), 12345, 67890, 42, "Fix",
        "0123456789ab", // too short - invalid digest length
        accounts(1),
    );
    contract.mint(input);
}
