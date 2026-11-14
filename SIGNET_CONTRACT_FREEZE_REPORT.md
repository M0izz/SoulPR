SIGNET CONTRACT FREEZE REPORT
=============================

Generated: Verification timebox completed
Branch/HEAD: cline/bcac1, c6f557fb287107631a4b34a5da8adb4fe1f63d1a

CHANGED FILES (integration worktree only):
- contract/near/tests/lib.rs: Test boundary repairs and struct fixes
- (src/lib.rs: unchanged - EvidenceReference structure preserved)

CHECK RESULTS:
1. cargo fmt --check: COULD NOT VERIFY - blocked by Application Control policy (os error 4551)
2. cargo check --target wasm32-unknown-unknown: BLOCKED - Application Control policy
   prevents rebuilding proc-macro2, quote, serde_core, borsh dependencies (os error 4551)
3. cargo test: BLOCKED - same Application Control policy

BLOCKERS:
- Windows Application Control policy (os error 4551) blocks build toolchain
- 3 Rust syntax errors (2 fixed, 1 in src/lib.rs ipfs:// URI struct)
- ipfs:// URI structural issue in src/lib.rs (not resolved - documented)

FIXED IN test/lib.rs:
1. Line 344: Added missing `}` to close `invalid_digest_length_is_rejected()` function
   (was missing closing brace, causing "unclosed delimiter" error)

2. Lines 455-463: Repaired malformed test boundaries
   - Converted stray `mut contract = SoulPR::init(...)` outside function body
   - Created proper `evidence_sha256_wrong_is_rejected()` test function with correct `let mut contract` syntax
   - Preserved all test assertions (identity hash mismatch test and evidence sha256 mismatch test still present)

3. Line 255: Fixed `fn backend_can_mint_and_duplicate_is_rejected()` nested inside
   `fn version_string_too_long_is_rejected()` - added closing `}` to separate the functions

4. make_input() call in version_string_too_long_is_rejected(): Added missing `)` closing delimiter

PRESERVED:
- All test functions and assertions
- Authorization and hashing behavior
- Event schema storage structure
- EvidenceReference construction

UNRESOLVED:
- src/lib.rs: ipfs:// URI struct mismatch (lines 571-576) - requires AppControl bypass
- Empty URI validity against schema - needs schema fixture verification
- Application Control policy 4551 - cannot bypass per security policy

GIT STATUS:
- Branch: cline/bcac1, up to date with origin
- Worktree: C:\Users\Moiz\.cline\worktrees\signet-stage1-integration
- No commits, pushes, merges, or deploys performed

TIMEBOX: 20 minutes maximum - verification stopped at blocker