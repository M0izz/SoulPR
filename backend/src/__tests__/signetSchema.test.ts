import fs from "fs";
import path from "path";
import { credentialIdentityHashHex, encodeCredentialIdentity } from "../signetSchema";

const fixtures = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../shared/signet/identity-vectors.json"), "utf8"));

describe("SIGNET Stage 1 identity fixtures", () => {
  for (const vector of fixtures.vectors) {
    test(`matches shared vector for PR #${vector.pr_number}`, () => {
      const input = {
        githubUserId: vector.github_user_id,
        repositoryId: vector.repository_id,
        prNumber: vector.pr_number,
        mergeCommitSha: vector.merge_commit_sha,
        category: vector.category as "merged_pull_request",
      };
      expect(encodeCredentialIdentity(input).toString("hex")).toBe(vector.encoded_hex);
      expect(credentialIdentityHashHex(input)).toBe(vector.digest_hex);
    });
  }

  test("excludes contributor account and rejects unknown category", () => {
    const input = { githubUserId: 1, repositoryId: 2, prNumber: 3, mergeCommitSha: "a".repeat(64), category: "merged_pull_request" as const };
    expect(credentialIdentityHashHex(input)).toBe(credentialIdentityHashHex({ ...input }));
    expect(() => encodeCredentialIdentity({ ...input, category: "review" as never })).toThrow();
    expect(() => encodeCredentialIdentity({ ...input, mergeCommitSha: input.mergeCommitSha.toUpperCase() })).toThrow();
    expect(() => encodeCredentialIdentity({ ...input, mergeCommitSha: "a" })).toThrow();
  });
});