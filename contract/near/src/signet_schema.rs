use near_sdk::{env, AccountId};

pub const SIGNET_SCHEMA: &str = "signet-credential-1.0.0";
pub const SIGNET_METADATA_SCHEMA: &str = "signet-metadata-1.0.0";
pub const SIGNET_STATUS_SCHEMA: &str = "signet-status-1.0.0";
pub const SIGNET_ARTWORK_TEMPLATE: &str = "signet-artwork-1.0.0";
pub const SIGNET_IDENTITY_DOMAIN: &str = "signet:credential-identity:v1";
pub const SIGNET_COMPATIBILITY: &str = "signet-soulbound-registry-1.0.0";

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum CredentialCategory {
    MergedPullRequest,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum VerificationStatus {
    Valid,
    UnderReview,
    Revoked,
    Superseded,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RevocationReason {
    IssuedInError,
    SourceCorrection,
    AccountBindingError,
    PolicyViolation,
    PrivacyTombstone,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct EvidenceReference {
    pub uri: String,
    pub sha256: Vec<u8>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct CredentialEvidence {
    pub credential_id: String,
    pub contributor_account_id: AccountId,
    pub github_user_id: u64,
    pub github_username_at_issuance: String,
    pub repository_id: u64,
    pub repository_full_name: String,
    pub pr_number: u64,
    pub pr_title: String,
    pub merge_commit_sha: String,
    pub merge_timestamp: u64,
    pub issuer_account_id: AccountId,
    pub issued_at: u64,
    pub credential_category: CredentialCategory,
    pub metadata_version: String,
    pub artwork: EvidenceReference,
    pub evidence: EvidenceReference,
    pub identity_hash: Vec<u8>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct CredentialMintInput {
    pub contributor_account_id: AccountId,
    pub github_user_id: u64,
    pub github_username_at_issuance: String,
    pub repository_id: u64,
    pub repository_full_name: String,
    pub pr_number: u64,
    pub pr_title: String,
    pub merge_commit_sha: String,
    pub merge_timestamp: u64,
    pub credential_category: CredentialCategory,
    pub metadata_version: String,
    pub artwork: EvidenceReference,
    pub evidence: EvidenceReference,
    pub identity_hash: Vec<u8>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct CredentialStatus {
    pub verification_status: VerificationStatus,
    pub status_version: u64,
    pub revoked_at: Option<u64>,
    pub revocation_reason: Option<RevocationReason>,
    pub revocation_reference: Option<EvidenceReference>,
    pub corrected_by_credential_id: Option<String>,
    pub supersedes_credential_id: Option<String>,
    pub last_status_update_at: u64,
    pub last_status_updated_by: AccountId,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Credential {
    pub evidence: CredentialEvidence,
    pub status: CredentialStatus,
}

fn u64_be(value: u64) -> [u8; 8] {
    value.to_be_bytes()
}

fn length_delimited_ascii(value: &str, field: &str) -> Vec<u8> {
    assert!(value.is_ascii(), "ERR_{}_NOT_ASCII", field);
    assert!(value.len() <= u16::MAX as usize, "ERR_{}_TOO_LONG", field);
    let mut result = Vec::with_capacity(2 + value.len());
    result.extend_from_slice(&(value.len() as u16).to_be_bytes());
    result.extend_from_slice(value.as_bytes());
    result
}

pub fn encode_credential_identity(
    github_user_id: u64,
    repository_id: u64,
    pr_number: u64,
    merge_commit_sha: &str,
    category: CredentialCategory,
) -> Vec<u8> {
    let sha = merge_commit_sha.to_string();
    assert!(
        sha.len() == 64
            && sha.bytes().all(|b| b.is_ascii_hexdigit())
            && sha.bytes().all(|b| !b.is_ascii_uppercase()),
        "ERR_INVALID_MERGE_SHA"
    );
    let category = match category {
        CredentialCategory::MergedPullRequest => "merged_pull_request",
    };
    let mut result = Vec::new();
    result.extend_from_slice(SIGNET_IDENTITY_DOMAIN.as_bytes());
    result.extend_from_slice(&u64_be(github_user_id));
    result.extend_from_slice(&u64_be(repository_id));
    result.extend_from_slice(&u64_be(pr_number));
    result.extend_from_slice(&length_delimited_ascii(&sha, "MERGE_SHA"));
    result.extend_from_slice(&length_delimited_ascii(category, "CATEGORY"));
    result
}

pub fn credential_identity_hash(
    github_user_id: u64,
    repository_id: u64,
    pr_number: u64,
    merge_commit_sha: &str,
    category: CredentialCategory,
) -> Vec<u8> {
    env::sha256(&encode_credential_identity(
        github_user_id,
        repository_id,
        pr_number,
        merge_commit_sha,
        category,
    ))
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::{test_utils::VMContextBuilder, testing_env, AccountId};

    const SHARED_IDENTITY_FIXTURES: &str =
        include_str!("../../../shared/signet/identity-vectors.json");

    fn setup() {
        testing_env!(VMContextBuilder::new()
            .current_account_id(AccountId::new_unchecked("signet.testnet".into()))
            .build());
    }

    fn hex(bytes: &[u8]) -> String {
        bytes.iter().map(|b| format!("{b:02x}")).collect()
    }

    #[test]
    fn shared_identity_vectors_match() {
        setup();
        let fixture: near_sdk::serde_json::Value =
            near_sdk::serde_json::from_str(SHARED_IDENTITY_FIXTURES).unwrap();
        assert_eq!(fixture["domain"], SIGNET_IDENTITY_DOMAIN);

        for vector in fixture["vectors"].as_array().unwrap() {
            let github = vector["github_user_id"].as_u64().unwrap();
            let repo = vector["repository_id"].as_u64().unwrap();
            let pr = vector["pr_number"].as_u64().unwrap();
            let sha = vector["merge_commit_sha"].as_str().unwrap();
            let encoded = vector["encoded_hex"].as_str().unwrap();
            let digest = vector["digest_hex"].as_str().unwrap();

            assert_eq!(
                hex(&encode_credential_identity(
                    github,
                    repo,
                    pr,
                    sha,
                    CredentialCategory::MergedPullRequest,
                )),
                encoded
            );
            assert_eq!(
                hex(&credential_identity_hash(
                    github,
                    repo,
                    pr,
                    sha,
                    CredentialCategory::MergedPullRequest,
                )),
                digest
            );
        }
    }

    #[test]
    #[should_panic(expected = "ERR_INVALID_MERGE_SHA")]
    fn uppercase_sha_is_rejected_instead_of_normalized() {
        setup();
        encode_credential_identity(
            1,
            2,
            3,
            "ABCDEF0123456789",
            CredentialCategory::MergedPullRequest,
        );
    }
}
