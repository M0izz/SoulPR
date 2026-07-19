# Product Requirements Document: OSS Contribution Receipt

**Codename:** Receipt
**Author:** Moizz
**Hackathon:** BuildAnything Spark (Monad)
**Version:** 1.0
**Date:** July 18, 2026

---

## 1. Executive Summary

Receipt is a system that automatically converts merged GitHub pull requests into permanent, unfakeable, wallet-bound proof of contribution — a soulbound token (SBT) minted the moment a PR merges. It solves a real, personal problem: there is currently no fast, trustworthy way for a contributor to prove "I built this" to a recruiter, a maintainer, a hackathon judge, or a future collaborator, without asking them to dig through commit history that can be edited, rebased, or deleted.

Built for the hackathon as a working MVP across three ECSoC26 repos, Receipt is architected from day one as a real product, not a demo: the backend, contract, and dashboard are designed to generalize to any public GitHub repo, not just the ones used in the demo.

---

## 2. Problem Statement

**Who has this problem:** Any developer who contributes to open source, freelances, or job-hunts based on demonstrable work — including the author, who is actively juggling contributions across `filedrop`, `CNTRL`, `JugaadLang`, and `semantic-plagiarism-detector` for ECSoC26 alone.

**Why existing solutions fall short:**
- A GitHub profile is self-hosted by GitHub — repos can be made private, deleted, or have history rewritten, silently invalidating claimed work.
- Screenshots and PR links require the verifier to trust the source and manually check each one — doesn't scale past 2-3 claims.
- LinkedIn "skills" and resume bullet points are unverifiable by design.
- No existing tool converts real, verifiable dev activity into something portable, permanent, and instantly checkable by a third party.

**The core insight:** GitHub already knows, with certainty, when you merged a PR. The missing piece is taking that fact out of GitHub's custody and putting it somewhere no single party (including GitHub, including the contributor) can quietly alter it later.

---

## 3. Product Vision (Beyond the Hackathon)

The hackathon build is a vertical slice of a larger product with real standalone value:

| Horizon | What it looks like |
|---|---|
| **Hackathon (now)** | Works on 2-4 repos the author controls. One badge type. Manual wallet-linking. Single-chain (Monad testnet). |
| **3 months post-hackathon** | Public app: any maintainer can install the GitHub App on their repo in one click. Any contributor can link their wallet once and it works across every repo that's installed it. Tiered badges (first PR, 10th PR, long-term maintainer). |
| **6-12 months** | Becomes a credibility layer other tools plug into — a "verified contributor" badge embeddable in resumes, a lookup API for recruiters/maintainers, integration with hackathon judging platforms (this hackathon's own judging agent is a natural first customer), integration with bounty platforms so payout eligibility can be gated on verified history. |
| **Monetization paths** | Freemium for individual contributors (free); paid tier for organizations wanting private-repo attestation, custom badge tiers, or API access; a small cut on bounty-platform integrations. |

This vision shapes the MVP scoping below: build the narrow slice honestly, but don't paint the architecture into a corner that only works for one hackathon.

---

## 4. Goals and Non-Goals

### Goals (hackathon MVP)
- A merged PR on a connected repo mints a soulbound badge to the contributor's linked wallet within ~1 minute, with no manual step from the contributor at merge time.
- Any wallet address can be looked up on a public dashboard to see a verifiable, timestamped contribution history.
- Every badge is checkable independently on a Monad block explorer — the dashboard is a convenience layer, not the source of truth.
- The demo covers a real, live merge on a real repo the author maintains, not a scripted mock.

### Non-Goals (explicitly out of scope for MVP)
- No trading, transferring, or marketplace for badges — they are soulbound by design.
- No support for private repos in the MVP (adds auth complexity with no demo value).
- No automatic GitHub-username-to-wallet resolution — requires an explicit one-time linking step.
- No mainnet deployment for the hackathon (testnet only; mainnet is a post-hackathon milestone once the contract has been reviewed).
- No AI-based contribution quality scoring — the product proves *that* work happened, not how good it was. Keeping this boundary sharp avoids overclaiming and avoids a whole separate (and much harder) trust problem.

---

## 5. Target Users

| User | Need |
|---|---|
| **Open-source contributor** (primary — this is the author) | Wants a portable, verifiable record of contributions across many repos and hackathons for resumes, applications, and community credibility. |
| **Repo maintainer** | Wants a low-effort way to recognize and verify contributor history without manually vetting every claim. |
| **Verifier** (recruiter, hackathon judge, future collaborator) | Wants to check a claim of "I contributed to X" in under a minute without needing GitHub access or technical GitHub literacy. |

---

## 6. Core Features (MVP)

### 6.1 GitHub webhook listener
- Subscribes to `pull_request` events on connected repos.
- Filters for `action == "closed"` and `merged == true`.
- Verifies GitHub's webhook signature (HMAC) to reject spoofed events.
- Extracts: repo name, PR number, PR title, merger's GitHub username, merge timestamp, commit SHA.

### 6.2 Wallet linking
- One-time flow: contributor connects a wallet (e.g. MetaMask) and signs a message proving ownership; this is paired with their GitHub username and stored.
- Without a linked wallet, a merge event is queued but not minted, with a clear message to the contributor to link their wallet to claim it.

### 6.3 Soulbound attestation contract
- ERC-5192-style (or hand-rolled non-transferable ERC-721) contract on Monad testnet.
- One token per (contributor, repo, PR number) — prevents duplicate minting on webhook retries.
- Minimal on-chain data: contributor address, repo identifier, PR number, timestamp. Token metadata (`tokenURI`) returns a small inline JSON, no external pinning dependency for the MVP.
- Transfer functions explicitly revert — provably soulbound, not just soulbound by convention.

### 6.4 Public dashboard
- Enter any wallet address → see all badges: repo, PR number, title, timestamp.
- Each badge links directly to its transaction on a Monad block explorer for independent verification.
- No login required to *view* — verification should have zero friction for the person checking a claim.

### 6.5 Idempotency and reliability
- Webhook retries (GitHub retries failed deliveries) must not double-mint — enforced at the contract level via the unique (contributor, repo, PR) key, not just application logic.
- Failed mints (e.g. no linked wallet yet) are queued and retried once a wallet is linked, not silently dropped.

---

## 7. Technical Architecture

```
GitHub (PR merged)
   -> Webhook -> Listener service (Node.js, verifies signature, dedupes)
   -> Chain write (ethers.js/viem) -> Attestation contract (Solidity, Monad testnet)
   -> Dashboard (React + Vite) reads directly from chain / indexed events
```

**Stack decisions (mapped to the author's existing toolset where possible):**
- **Listener + chain-write service:** Node.js — chosen over FastAPI/Python for this specific service because Solidity tooling (Hardhat) and chain libraries (ethers.js/viem) are more mature and better documented in JS, reducing hackathon-week risk.
- **Wallet-linking storage:** Firebase (already in the author's stack) — simple collection of `{githubUsername, walletAddress, signature}`.
- **Smart contract tooling:** Hardhat (more beginner-friendly docs for Monad specifically than Foundry).
- **Frontend:** React + Vite, direct contract reads via ethers.js/viem.
- **Hosting:** Frontend on Firebase Hosting or Vercel; backend on Render/Railway (needs a public URL reachable by GitHub's webhook).

**Why this generalizes beyond the hackathon:** the webhook listener is repo-agnostic by design (it reads repo identity from the payload, not from hardcoded config), so adding a new repo post-hackathon is a GitHub App installation, not a code change.

---

## 8. Smart Contract Design

```solidity
// Simplified sketch — see follow-up for full implementation
struct Attestation {
    address contributor;
    string  repo;       // e.g. "moizz/CNTRL"
    uint256 prNumber;
    uint256 timestamp;
}

event Attested(address indexed contributor, string repo, uint256 prNumber, uint256 timestamp);

mapping(bytes32 => bool) public minted; // key = hash(repo, prNumber) — prevents duplicate mints

function attest(address contributor, string calldata repo, uint256 prNumber) external onlyBackend {
    bytes32 key = keccak256(abi.encodePacked(repo, prNumber));
    require(!minted[key], "already attested");
    minted[key] = true;
    _mint(contributor, ...); // soulbound mint, transfer functions revert
    emit Attested(contributor, repo, prNumber, block.timestamp);
}
```

- `onlyBackend` — for the MVP, only the listener service's wallet can call `attest`, which is an honest trust assumption to disclose (see Risks).
- Post-hackathon hardening path: move minting authority to a decentralized oracle or a multi-sig of trusted GitHub App validators, so no single backend can forge attestations.

---

## 9. Key User Flows

**Flow A — Contributor merges a PR (happy path)**
1. Contributor opens a PR on a connected repo, gets it reviewed and merged as normal.
2. Within ~1 minute, a badge appears in their wallet.
3. They can immediately view it on the dashboard by pasting their wallet address.

**Flow B — Verifier checks a claim**
1. Verifier receives a wallet address or dashboard link from the contributor.
2. Opens the dashboard, sees a list of repo/PR/timestamp entries.
3. Clicks through to the Monad explorer to independently confirm the transaction is real and unmodified.

**Flow C — New contributor, no linked wallet yet**
1. PR merges, event is queued.
2. Contributor links their wallet later.
3. Queued attestation mints retroactively, with the original merge timestamp preserved (not the linking timestamp).

---

## 10. Success Metrics

**Hackathon demo success:**
- One real, live PR merge → visible badge → verifiable on-chain, end to end, in under 3 minutes.
- Zero hardcoded/mocked data in the demo path.

**Post-hackathon product success (if pursued):**
- Number of repos with the GitHub App installed.
- Number of unique contributors with at least one badge.
- Number of external verifier lookups (signal that people are actually using it to check claims, not just mint them).

---

## 11. Risks and Honest Limitations

| Risk | Mitigation / Disclosure |
|---|---|
| Backend wallet is a single point of trust for minting | Disclosed openly in the README and demo; roadmap item to decentralize via oracle/multisig. |
| Testnet only for the hackathon | Clearly labeled; mainnet deployment is a deliberate post-hackathon step, not a hidden limitation. |
| Wallet-linking adds friction | Accepted tradeoff — one-time cost for permanent, portable proof; still far less friction than manually compiling a portfolio. |
| Gas costs on mainnet at scale | Monad's low fees make this viable even at high contribution volume; still worth monitoring if usage grows. |
| GitHub webhook downtime/rate limits | Queue-and-retry design absorbs transient failures; GitHub's own retry policy provides a first layer of resilience. |

---

## 12. Submission Mapping (BuildAnything Spark)

- **Problem:** No fast, trustworthy way to prove real open-source contribution.
- **Solution:** Automatic, wallet-bound, tamper-proof attestation minted the moment a PR merges.
- **Category:** Monad Testnet (MVP), with a stated mainnet roadmap.
- **Anti-slop checklist:** live demo on a real repo, no placeholder data, one genuinely functioning feature (mint + verify) rather than five half-built ones, clear README with setup instructions and disclosed limitations.

---

## 13. Build Timeline (Hackathon Week)

| Day | Milestone |
|---|---|
| 1 | Contract written + deployed to Monad testnet; webhook listener skeleton receiving real GitHub events. |
| 2 | Wallet-linking flow (Firebase) + listener calling `attest()` end-to-end on one test repo. |
| 3 | Dashboard: wallet lookup + explorer links. |
| 4 | Polish, disclosed-limitations README, demo video, live test on a real ECSoC26 repo. |
| 5 | Submission: name, description, problem, solution, project URL, GitHub repo, contract address, demo video, social post. |

---

## 14. Open Questions for Next Iteration

- Should badge tiers (first PR / 10th PR / maintainer status) be part of the MVP, or a clean v2 feature to avoid scope creep this week?
- Should the dashboard index events itself (faster, needs infra) or read directly from chain each time (simpler, slower at scale)?
