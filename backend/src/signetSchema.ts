import { createHash } from "crypto";

export const SIGNET_SCHEMA = "signet-credential-1.0.0" as const;
export const SIGNET_METADATA_SCHEMA = "signet-metadata-1.0.0" as const;
export const SIGNET_STATUS_SCHEMA = "signet-status-1.0.0" as const;
export const SIGNET_ARTWORK_TEMPLATE = "signet-artwork-1.0.0" as const;
export const SIGNET_IDENTITY_DOMAIN = "signet:credential-identity:v1" as const;
export const SIGNET_COMPATIBILITY = "signet-soulbound-registry-1.0.0" as const;

export type SignetCategory = "merged_pull_request";
export type SignetStatus = "valid" | "under_review" | "revoked" | "superseded";
export type SignetRevocationReason =
  | "issued_in_error"
  | "source_correction"
  | "account_binding_error"
  | "policy_violation"
  | "privacy_tombstone";

export interface SignetEvidenceReference { uri: string; sha256: string; }

export interface SignetCredentialMintInput {
  contributorAccountId: string;
  githubUserId: number;
  githubUsernameAtIssuance: string;
  repositoryId: number;
  repositoryFullName: string;
  prNumber: number;
  prTitle: string;
  mergeCommitSha: string;
  mergeTimestamp: number;
  category: SignetCategory;
  metadataVersion: typeof SIGNET_SCHEMA;
  artwork: SignetEvidenceReference;
  evidence: SignetEvidenceReference;
  identityHash: string;
}

export interface SignetCredentialStatus {
  verificationStatus: SignetStatus;
  statusVersion: number;
  revokedAt?: number;
  revocationReason?: SignetRevocationReason;
  revocationReference?: SignetEvidenceReference;
  correctedByCredentialId?: string;
  supersedesCredentialId?: string;
  lastStatusUpdatedBy: string;
  lastStatusUpdateAt: number;
}

export interface SignetCredential {
  credentialId: string;
  ownerId: string;
  evidence: SignetCredentialMintInput & { issuerAccountId: string; issuedAt: number };
  status: SignetCredentialStatus;
}

function u64(value: number, field: string): Buffer {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${field} must be an unsigned safe integer`);
  const result = Buffer.alloc(8);
  result.writeBigUInt64BE(BigInt(value));
  return result;
}

function lengthDelimitedAscii(value: string, field: string): Buffer {
  if (!/^[\x00-\x7F]*$/.test(value)) throw new Error(`${field} must be ASCII`);
  const bytes = Buffer.from(value, "ascii");
  if (bytes.length > 0xffff) throw new Error(`${field} exceeds u16 length`);
  const prefix = Buffer.alloc(2);
  prefix.writeUInt16BE(bytes.length);
  return Buffer.concat([prefix, bytes]);
}

export function encodeCredentialIdentity(input: Pick<SignetCredentialMintInput, "githubUserId" | "repositoryId" | "prNumber" | "mergeCommitSha" | "category">): Buffer {
  const sha = input.mergeCommitSha;
  if (!/^[0-9a-f]{64}$/.test(sha)) throw new Error("mergeCommitSha must be a 64-character lowercase canonical hexadecimal string");
  if (input.category !== "merged_pull_request") throw new Error("unsupported SIGNET category");
  return Buffer.concat([
    Buffer.from(SIGNET_IDENTITY_DOMAIN, "utf8"),
    u64(input.githubUserId, "githubUserId"),
    u64(input.repositoryId, "repositoryId"),
    u64(input.prNumber, "prNumber"),
    lengthDelimitedAscii(sha, "mergeCommitSha"),
    lengthDelimitedAscii(input.category, "category"),
  ]);
}

export function credentialIdentityHash(input: Pick<SignetCredentialMintInput, "githubUserId" | "repositoryId" | "prNumber" | "mergeCommitSha" | "category">): Buffer {
  return createHash("sha256").update(encodeCredentialIdentity(input)).digest();
}

export function credentialIdentityHashHex(input: Pick<SignetCredentialMintInput, "githubUserId" | "repositoryId" | "prNumber" | "mergeCommitSha" | "category">): string {
  return credentialIdentityHash(input).toString("hex");
}