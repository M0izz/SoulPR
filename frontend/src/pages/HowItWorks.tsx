import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconArrowRight,
  IconCheck,
  IconShieldCheck,
  IconExternalLink,
  IconCode,
  IconLock,
  IconSearch,
  IconZap,
} from '../components/Icons'

interface ProtocolStage {
  id: number
  title: string
  subtitle: string
  badge: string
  description: string
  guarantees: string[]
  technicalPayload: string
}

const PROTOCOL_STAGES: ProtocolStage[] = [
  {
    id: 1,
    title: 'Discovery & Ingestion',
    subtitle: 'GitHub Merged PR Ingestion',
    badge: 'Stage 01 · Origin',
    description:
      'When an open-source pull request merges in an eligible repository, SIGNET captures the event via cryptographic HMAC-signed webhooks or through an authenticated manual PR URL import. Source facts are extracted directly from GitHub.',
    guarantees: [
      'Authentic HMAC SHA-256 webhook signature verification',
      'Stable GitHub user ID binding (immutable across username renames)',
      'Deterministic extraction of merge commit SHA and timestamp',
      'Deduplication via repository ID + PR number',
    ],
    technicalPayload: `// Event payload captured at ingestion
{
  "source": "github:pull_request:closed:merged",
  "repository": "near/nearcore",
  "repository_id": 169824053,
  "pr_number": 10482,
  "commit_sha": "d3b07384d113edec49eaa6238ad5ff00",
  "author_id": 4829104,
  "merged_at": "2026-11-14T19:42:00Z"
}`,
  },
  {
    id: 2,
    title: 'Deterministic Evidence Dossier',
    subtitle: 'Cryptographic Snapshot & Assessment',
    badge: 'Stage 02 · Integrity',
    description:
      'Raw GitHub facts are normalized into an immutable evidence snapshot. A SHA-256 digest is generated over the canonical canonical representation, and deterministic eligibility rules evaluate whether all objective criteria are met.',
    guarantees: [
      'Canonical SHA-256 digest of normalized evidence fields',
      'Objective ruleset evaluation (PR merged, author matched, not duplicate)',
      'Explicit boundary between verified facts and limitations',
      'Zero subjective scoring, leaderboards, or speculative rating',
    ],
    technicalPayload: `// Canonical Evidence Snapshot & Digest
{
  "schema_version": "signet.evidence.v1.0",
  "digest_algorithm": "sha256",
  "evidence_digest": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "ruleset_version": "2026-11-15.v1",
  "evaluation": {
    "pr_is_merged": true,
    "author_matches_authenticated_user": true,
    "near_wallet_linked": true,
    "eligibility_outcome": "ELIGIBLE"
  }
}`,
  },
  {
    id: 3,
    title: 'Two-Step Developer Agency',
    subtitle: 'Explicit Approval Before Wallet Signature',
    badge: 'Stage 03 · Sovereignty',
    description:
      'Unlike automated badge games that mint unconsented tokens, SIGNET enforces developer sovereignty. The contributor inspects the complete dossier, explicitly clicks "Approve", and separately reviews the NEAR transaction payload prior to signing.',
    guarantees: [
      'No automated or unconsented minting upon PR merge',
      'Approval is cryptographically bound to the specific snapshot digest',
      'Clear transaction preview (destination account, gas, contract method)',
      'Wallet signature request cancellation creates no failed on-chain artifact',
    ],
    technicalPayload: `// Pre-transaction intent bound to digest
{
  "intent": "signet::authorize_issuance",
  "contributor_account": "builder.testnet",
  "evidence_snapshot_digest": "7f83b1657ff1fc53b92dc18148a1d65d...",
  "contract_id": "signet.testnet",
  "method_name": "mint_credential",
  "deposit_yocto": "0",
  "requires_wallet_authorization": true
}`,
  },
  {
    id: 4,
    title: 'NEAR Finality & Public Verification',
    subtitle: 'Decentralized Proof on NEAR Protocol',
    badge: 'Stage 04 · Permanence',
    description:
      'Once authorized by the contributor, the attestation transaction achieves finality on NEAR Protocol. The credential becomes an immutable contribution mark, readable by anyone via the public verification portal without requiring an account.',
    guarantees: [
      'Immutable state record committed to the NEAR smart contract',
      'Human-readable NEAR account ownership (e.g., moizz.testnet)',
      'Canonical public verification page with full evidence trail',
      'Shareable visual credential card pointing to on-chain truth',
    ],
    technicalPayload: `// Confirmed on-chain contract state
{
  "token_id": "signet-nearcore-10482",
  "owner_id": "builder.testnet",
  "metadata": {
    "title": "Fix memory leak in chunk validator pipeline",
    "evidence_hash": "7f83b1657ff1fc53b92dc18148a1d65d...",
    "issued_at": 1794689000,
    "contract": "signet.testnet",
    "network": "near:testnet"
  },
  "status": "CONFIRMED_ON_CHAIN"
}`,
  },
]

const FAQS = [
  {
    category: 'Protocol',
    q: 'What is SIGNET and how does it differ from traditional badge platforms?',
    a: 'SIGNET is an evidence-first contribution credential system for open-source developers. Unlike badge platforms or NFT marketplaces, SIGNET does not invent arbitrary scores, gamify commits, or mint tokens automatically. It produces structured, content-addressed evidence dossiers of real merged GitHub PRs, requiring deliberate developer approval and NEAR blockchain authorization before an immutable record is established.',
  },
  {
    category: 'Protocol',
    q: 'Why does SIGNET require two separate approvals to issue a credential?',
    a: 'Developer sovereignty is a core principle. First, you inspect the evidence dossier and approve the snapshot of source facts and rule evaluations. Second, you explicitly review the NEAR transaction details (contract, method, gas, destination) in your wallet. Discovering a merged PR never automatically triggers a transaction on your behalf.',
  },
  {
    category: 'NEAR & Keys',
    q: 'Why is SIGNET built on NEAR Protocol?',
    a: 'NEAR provides sub-second transaction finality, predictable micro-gas fees, native ed25519 cryptographic key management, and human-readable account names (such as developer.testnet or moizz.near). This allows credentials to be securely attributed to real builders without confusing hexadecimal addresses.',
  },
  {
    category: 'NEAR & Keys',
    q: 'How is my NEAR wallet linked to my GitHub account?',
    a: 'Linking uses a cryptographic challenge-response handshake. The server issues a short-lived, single-use cryptographic nonce bound to your authenticated GitHub session. Your NEAR wallet signs this challenge using its ed25519 key. SIGNET verifies the signature against the on-chain account key before establishing the association.',
  },
  {
    category: 'Protocol',
    q: 'Does SIGNET claim to judge whether my code is "high quality"?',
    a: 'No. PRD Section 8 explicitly defines code quality scoring as an anti-goal. GitHub metadata proves that code was merged into a branch; it cannot prove architectural superiority or long-term impact. SIGNET guarantees objective provenance (author identity, merge commit SHA, timestamp, and repository integrity), leaving evaluation to human peers.',
  },
  {
    category: 'Privacy & Security',
    q: 'Is private repository code or sensitive data exposed?',
    a: 'Never. Public verification records expose only the minimum necessary provenance metadata: repository name, PR title, number, merge timestamp, commit SHA, and cryptographic digests. SIGNET never publishes private repository source code, access tokens, email addresses, or unapproved review comments.',
  },
  {
    category: 'Privacy & Security',
    q: 'How does third-party verification work for recruiters or clients?',
    a: 'Every issued credential has a canonical public URL (e.g. /verify/signet-nearcore-10482). Anyone can inspect the evidence dossier, check the cryptographic SHA-256 digest, and query the NEAR smart contract directly on NEAR Explorer without creating a SIGNET account or installing browser extensions.',
  },
  {
    category: 'NEAR & Keys',
    q: 'What happens if a synchronization or NEAR RPC node experiences downtime?',
    a: 'SIGNET enforces truthful state handling. If an RPC endpoint or GitHub API is temporarily unreachable, the interface displays "Unable to verify" or "Pending reconciliation" rather than falsely labeling the credential invalid or pretending it was confirmed.',
  },
]

const ECOSYSTEM_BADGES = [
  { name: 'NEAR Protocol', role: 'Smart Contract & State Ledger', color: '#00EC97' },
  { name: 'GitHub API', role: 'Source Evidence & Webhooks', color: '#EDE2D0' },
  { name: 'Rust Engine', role: 'Contract Logic & NEP Standards', color: '#DEA584' },
  { name: 'ed25519', role: 'Cryptographic Signature Authority', color: '#B9572B' },
  { name: 'SHA-256', role: 'Content-Addressed Snapshots', color: '#76675B' },
]

export default function HowItWorks() {
  const navigate = useNavigate()
  const [activeStageId, setActiveStageId] = useState<number>(1)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [faqSearch, setFaqSearch] = useState<string>('')
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0)

  // Interactive Live Simulator state
  const [simPrUrl, setSimPrUrl] = useState<string>('https://github.com/near/nearcore/pull/10482')
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [simProgress, setSimProgress] = useState<number>(0)
  const [simStepText, setSimStepText] = useState<string>('')
  const [simResult, setSimResult] = useState<any | null>(null)

  const activeStage = useMemo(
    () => PROTOCOL_STAGES.find((s) => s.id === activeStageId) || PROTOCOL_STAGES[0],
    [activeStageId]
  )

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory
      const matchesSearch =
        faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.a.toLowerCase().includes(faqSearch.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, faqSearch])

  const runSimulation = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setSimProgress(15)
    setSimResult(null)
    setSimStepText('Extracting PR metadata & commit SHA from GitHub API...')

    setTimeout(() => {
      setSimProgress(45)
      setSimStepText('Constructing canonical JSON-LD evidence snapshot & computing SHA-256 digest...')
    }, 900)

    setTimeout(() => {
      setSimProgress(75)
      setSimStepText('Evaluating deterministic ruleset v1.0 (author check, merge state, dedupe)...')
    }, 1800)

    setTimeout(() => {
      setSimProgress(100)
      setSimStepText('Evidence dossier assembled. Awaiting developer explicit approval & NEAR signature.')
      setSimResult({
        prNumber: 10482,
        repo: 'near/nearcore',
        commitSha: 'd3b07384d113edec49eaa6238ad5ff00',
        digest: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        rulesPassed: '4 / 4 Checks Passed',
        eligibility: 'ELIGIBLE_FOR_ISSUANCE',
        timestamp: new Date().toISOString(),
      })
      setIsSimulating(false)
    }, 2700)
  }

  return (
    <div
      className="signet-enter-fade"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--paper)',
        color: 'var(--ink)',
        overflowX: 'hidden',
        paddingBottom: '6rem',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '420px',
          background:
            'radial-gradient(circle, rgba(185, 87, 43, 0.12) 0%, rgba(185, 87, 43, 0.03) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        className="signet-ambient-pulse"
      />

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3rem 1.5rem 2rem',
        }}
      >
        {/* ── 1. HERO HEADER ── */}
        <section style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '99px',
              background: 'var(--signet-orange-subtle)',
              border: '1px solid var(--signet-orange-border)',
              color: 'var(--signet-orange)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1.4rem',
            }}
          >
            <span className="signet-pulse-dot" />
            PROTOCOL ARCHITECTURE & VERIFICATION MANUAL
          </div>

          <h1
            className="signet-headline"
            style={{
              fontSize: 'clamp(32px, 5.2vw, 56px)',
              color: 'var(--ink)',
              maxWidth: '920px',
              margin: '0 auto 1.2rem',
              lineHeight: 1.15,
            }}
          >
            How Your Merged Work Becomes an{' '}
            <span style={{ color: 'var(--signet-orange)', fontStyle: 'italic' }}>
              Immutable Mark
            </span>
            .
          </h1>

          <p
            style={{
              fontSize: '16.5px',
              color: 'var(--ink-muted)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            SIGNET operates a disciplined, four-stage verification pipeline. We turn raw GitHub merge facts
            into cryptographic evidence dossiers and, upon your explicit authorization, permanent
            attestations on NEAR Protocol.
          </p>

          {/* Quick jump navigation pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <a href="#pipeline" className="btn-signet-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              1. Four-Stage Pipeline
            </a>
            <a href="#simulator" className="btn-signet-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              2. Interactive Simulator
            </a>
            <a href="#guarantees" className="btn-signet-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              3. Trust Guarantees
            </a>
            <a href="#faq" className="btn-signet-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              4. Technical FAQ
            </a>
          </div>
        </section>

        {/* ── 2. FOUR-STAGE PIPELINE (INTERACTIVE) ── */}
        <section id="pipeline" style={{ marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--signet-orange)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              CHRONOLOGY OF PROVENANCE
            </span>
            <h2
              className="signet-headline"
              style={{ fontSize: '32px', color: 'var(--ink)', marginTop: '6px' }}
            >
              The 4-Stage Verification Lifecycle
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', maxWidth: '580px', margin: '8px auto 0' }}>
              Select any stage below to inspect its cryptographic invariants, inputs, and security guarantees.
            </p>
          </div>

          {/* Stage Selector Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
              marginBottom: '2rem',
            }}
          >
            {PROTOCOL_STAGES.map((stage) => {
              const isSelected = stage.id === activeStageId
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className="signet-glass-card"
                  style={{
                    padding: '1.4rem 1.2rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--paper-overlay)' : 'var(--paper-raised)',
                    border: `1px solid ${
                      isSelected ? 'var(--signet-orange)' : 'var(--rule)'
                    }`,
                    boxShadow: isSelected
                      ? '0 0 20px rgba(185, 87, 43, 0.22), inset 0 0 0 1px var(--signet-orange)'
                      : undefined,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        color: isSelected ? 'var(--signet-orange)' : 'var(--ink-faint)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {stage.badge}
                    </span>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--signet-orange)' : 'var(--rule)',
                        color: isSelected ? '#EDE2D0' : 'var(--ink-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                      0{stage.id}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: isSelected ? 'var(--ink)' : 'var(--ink-muted)',
                      marginBottom: '4px',
                    }}
                  >
                    {stage.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>
                    {stage.subtitle}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Stage Deep-Dive Card */}
          <div
            className="signet-glass-card"
            style={{
              padding: '2.2rem',
              border: '1px solid var(--signet-orange-border)',
              background: 'var(--paper-raised)',
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem',
                alignItems: 'center',
              }}
            >
              {/* Left Column: Details & Guarantees */}
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: 'var(--signet-orange)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  <IconShieldCheck size={14} color="var(--signet-orange)" />
                  STAGE 0{activeStage.id} SPECIFICATION
                </div>
                <h3
                  className="signet-headline"
                  style={{ fontSize: '28px', color: 'var(--ink)', marginBottom: '12px' }}
                >
                  {activeStage.title}
                </h3>
                <p
                  style={{
                    fontSize: '14.5px',
                    color: 'var(--ink-muted)',
                    lineHeight: 1.65,
                    marginBottom: '1.5rem',
                  }}
                >
                  {activeStage.description}
                </p>

                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                  Cryptographic & Architectural Guarantees:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeStage.guarantees.map((g, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '13px',
                        color: 'var(--ink-muted)',
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(42, 125, 79, 0.12)',
                          color: '#2A7D4F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        <IconCheck size={11} color="#2A7D4F" />
                      </span>
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Code Payload Sample */}
              <div>
                <div
                  style={{
                    background: 'var(--signet-charcoal)',
                    border: '1px solid var(--signet-border-strong)',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(237, 226, 208, 0.1)',
                      paddingBottom: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      className="signet-mono"
                      style={{ fontSize: '11px', color: '#EDE2D0', fontWeight: 600 }}
                    >
                      signet-core/stage_0{activeStage.id}.json
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--signet-orange)',
                        background: 'rgba(185, 87, 43, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      VERIFIED SCHEMA
                    </span>
                  </div>
                  <pre
                    className="signet-mono"
                    style={{
                      fontSize: '12px',
                      color: '#EDE2D0',
                      lineHeight: '1.55',
                      overflowX: 'auto',
                      maxHeight: '260px',
                    }}
                  >
                    <code>{activeStage.technicalPayload}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. INTERACTIVE SIMULATOR PLAYGROUND ── */}
        <section id="simulator" style={{ marginBottom: '6rem' }}>
          <div
            className="signet-glass-card"
            style={{
              padding: '2.5rem',
              background: 'linear-gradient(180deg, var(--paper-raised) 0%, var(--paper) 100%)',
              border: '1px solid var(--rule-strong)',
              borderRadius: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--signet-orange)',
                  background: 'var(--signet-orange-subtle)',
                  border: '1px solid var(--signet-orange-border)',
                  padding: '4px 14px',
                  borderRadius: '99px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                }}
              >
                <IconZap size={12} color="var(--signet-orange)" />
                INTERACTIVE PROTOCOL SANDBOX
              </span>
              <h2 className="signet-headline" style={{ fontSize: '32px', color: 'var(--ink)' }}>
                Test the Evidence Ingestion Pipeline
              </h2>
              <p
                style={{
                  fontSize: '14.5px',
                  color: 'var(--ink-muted)',
                  maxWidth: '640px',
                  margin: '8px auto 0',
                }}
              >
                Simulate how SIGNET fetches GitHub PR metadata, constructs an immutable canonical
                dossier, checks eligibility rules, and forms an issuance intent for NEAR.
              </p>
            </div>

            {/* Input & Action */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                maxWidth: '720px',
                margin: '0 auto 1.5rem',
              }}
            >
              <input
                type="text"
                value={simPrUrl}
                onChange={(e) => setSimPrUrl(e.target.value)}
                placeholder="https://github.com/owner/repo/pull/123"
                className="signet-mono"
                style={{
                  flex: 1,
                  minWidth: '280px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--rule)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="btn-signet-primary"
                style={{ minWidth: '180px' }}
              >
                {isSimulating ? (
                  <>
                    <span className="spinner" style={{ width: '14px', height: '14px' }} />
                    Auditing...
                  </>
                ) : (
                  <>
                    <IconSearch size={14} color="#EDE2D0" />
                    Simulate Audit
                  </>
                )}
              </button>
            </div>

            {/* Simulation Progress & Live Output */}
            {isSimulating && (
              <div
                style={{
                  maxWidth: '720px',
                  margin: '0 auto 1.5rem',
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'var(--paper)',
                  border: '1px solid var(--rule)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--signet-orange)',
                    marginBottom: '6px',
                  }}
                >
                  <span>{simStepText}</span>
                  <span>{simProgress}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background: 'var(--rule)',
                    borderRadius: '99px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${simProgress}%`,
                      height: '100%',
                      background: 'var(--signet-orange)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Simulation Results Card */}
            {simResult && (
              <div
                className="signet-enter-fade"
                style={{
                  maxWidth: '720px',
                  margin: '0 auto',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: 'var(--paper)',
                  border: '1px solid rgba(42, 125, 79, 0.4)',
                  boxShadow: '0 8px 24px rgba(42, 125, 79, 0.08)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#2A7D4F',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconCheck size={12} color="#FFF" />
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#2A7D4F' }}>
                      Audit Passed: Evidence Dossier Ready
                    </span>
                  </div>
                  <span
                    className="signet-mono"
                    style={{
                      fontSize: '11px',
                      background: 'rgba(42, 125, 79, 0.1)',
                      color: '#2A7D4F',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    {simResult.eligibility}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    fontSize: '12.5px',
                    marginBottom: '1.2rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--ink-faint)', display: 'block' }}>Target PR:</span>
                    <span style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {simResult.repo} #{simResult.prNumber}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--ink-faint)', display: 'block' }}>Commit SHA:</span>
                    <span className="signet-mono" style={{ color: 'var(--ink)' }}>
                      {simResult.commitSha.slice(0, 14)}...
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--ink-faint)', display: 'block' }}>Rule Verification:</span>
                    <span style={{ fontWeight: 700, color: '#2A7D4F' }}>
                      {simResult.rulesPassed}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--paper-raised)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--rule)',
                    fontSize: '11.5px',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ color: 'var(--ink-faint)', display: 'block', marginBottom: '2px' }}>
                    Calculated SHA-256 Evidence Digest:
                  </span>
                  <span className="signet-mono" style={{ color: 'var(--signet-orange)', wordBreak: 'break-all' }}>
                    {simResult.digest}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    onClick={() => navigate('/verify/sample')}
                    className="btn-signet-primary"
                    style={{ fontSize: '12.5px', padding: '6px 14px' }}
                  >
                    View Real Dossier Sample <IconArrowRight size={12} color="#EDE2D0" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 4. TRUST GUARANTEES (THE 4 PILLARS) ── */}
        <section id="guarantees" style={{ marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.8rem' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--signet-orange)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              ARCHITECTURAL INTEGRITY
            </span>
            <h2 className="signet-headline" style={{ fontSize: '32px', color: 'var(--ink)' }}>
              The Four Pillars of SIGNET Trust
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            <div className="signet-glass-card" style={{ padding: '1.8rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--signet-orange-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <IconCode size={18} color="var(--signet-orange)" />
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                1. No Invented Facts
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                Every field in a credential resolves back to authenticated GitHub API events. We never
                fabricate commit counts, lines changed, or fake transaction hashes.
              </p>
            </div>

            <div className="signet-glass-card" style={{ padding: '1.8rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--signet-orange-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <IconShieldCheck size={18} color="var(--signet-orange)" />
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                2. No Quality Judgements
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                We certify objective provenance, not subjective opinions. There are no AI scores, badge
                tiers, or leaderboards that pretend GitHub metadata proves merit.
              </p>
            </div>

            <div className="signet-glass-card" style={{ padding: '1.8rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--signet-orange-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <IconLock size={18} color="var(--signet-orange)" />
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                3. Developer Sovereignty
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                Evidence approval and blockchain transaction signing are strictly distinct actions. No smart
                contract transaction is executed without explicit wallet confirmation.
              </p>
            </div>

            <div className="signet-glass-card" style={{ padding: '1.8rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--signet-orange-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <IconExternalLink size={18} color="var(--signet-orange)" />
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                4. Public Auditability
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                Anyone can independently verify an issued credential on NEAR without needing a SIGNET
                account, browser extension, or centralized permission.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. TECHNICAL FAQ ACCORDION ── */}
        <section id="faq" style={{ marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--signet-orange)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              TECHNICAL MANUAL & SPECIFICATION
            </span>
            <h2 className="signet-headline" style={{ fontSize: '32px', color: 'var(--ink)' }}>
              Frequently Answered Architecture Questions
            </h2>
          </div>

          {/* Search & Category Filter */}
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search protocol mechanics, NEAR keys, privacy..."
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid var(--rule)',
                  background: 'var(--paper-raised)',
                  color: 'var(--ink)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <IconSearch size={16} color="var(--ink-faint)" />
              </span>
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['All', 'Protocol', 'NEAR & Keys', 'Privacy & Security'].map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="btn-signet-secondary"
                    style={{
                      padding: '5px 14px',
                      fontSize: '12px',
                      background: isActive ? 'var(--stamp-bg)' : 'transparent',
                      borderColor: isActive ? 'var(--signet-orange)' : 'var(--rule)',
                      color: isActive ? 'var(--signet-orange)' : 'var(--ink-muted)',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accordion Items */}
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {filteredFaqs.length === 0 ? (
              <div
                style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: 'var(--ink-muted)',
                  fontSize: '14px',
                }}
              >
                No architectural questions match "{faqSearch}".
              </div>
            ) : (
              filteredFaqs.map((faq, i) => {
                const isOpen = expandedFaqIndex === i
                return (
                  <div
                    key={i}
                    className="signet-glass-card"
                    style={{
                      overflow: 'hidden',
                      border: `1px solid ${
                        isOpen ? 'var(--signet-orange-border)' : 'var(--rule)'
                      }`,
                      boxShadow: isOpen
                        ? '0 6px 20px rgba(185, 87, 43, 0.08)'
                        : undefined,
                      transition: 'all 0.22s ease',
                    }}
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isOpen ? null : i)}
                      style={{
                        width: '100%',
                        padding: '1.2rem 1.6rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontWeight: 700,
                          fontSize: '15px',
                          color: isOpen ? 'var(--signet-orange)' : 'var(--ink)',
                          lineHeight: 1.4,
                        }}
                      >
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: isOpen
                              ? 'var(--signet-orange)'
                              : 'var(--signet-orange-subtle)',
                            color: isOpen ? '#EDE2D0' : 'var(--signet-orange)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {isOpen ? '−' : '+'}
                        </span>
                        {faq.q}
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        className="signet-enter-fade"
                        style={{
                          padding: '0 1.6rem 1.4rem 3.8rem',
                          fontSize: '14px',
                          color: 'var(--ink-muted)',
                          lineHeight: 1.7,
                          borderTop: '1px solid var(--rule)',
                          paddingTop: '1rem',
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* ── 6. PROTOCOL ECOSYSTEM & STANDARDS ── */}
        <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 800,
              color: 'var(--ink-faint)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '1.4rem',
            }}
          >
            POWERED BY DECENTRALIZED OPEN-SOURCE INFRASTRUCTURE
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '14px',
            }}
          >
            {ECOSYSTEM_BADGES.map((b) => (
              <div
                key={b.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '99px',
                  background: 'var(--paper-raised)',
                  border: '1px solid var(--rule)',
                  fontSize: '12px',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: b.color,
                  }}
                />
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{b.name}</span>
                <span style={{ color: 'var(--ink-faint)' }}>· {b.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. BOTTOM CTA BANNER ── */}
        <section>
          <div
            className="signet-glass-card"
            style={{
              background: 'linear-gradient(135deg, var(--signet-charcoal) 0%, var(--signet-deep) 100%)',
              border: '1px solid var(--signet-border-strong)',
              borderRadius: '24px',
              padding: '3rem 2.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2rem',
              boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.45)',
            }}
          >
            <div style={{ maxWidth: '620px' }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: 'var(--signet-orange)',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                VERIFIABLE CONTRIBUTION ARCHIVE
              </div>
              <h3
                className="signet-headline"
                style={{ fontSize: '30px', color: '#EDE2D0', marginBottom: '8px' }}
              >
                Your work is your mark. Make it permanent.
              </h3>
              <p style={{ fontSize: '14.5px', color: '#A89E94', margin: 0, lineHeight: 1.6 }}>
                Connect your GitHub identity, review your discovered contribution dossiers, and build an
                indestructible open-source archive on NEAR.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-signet-primary"
                style={{ padding: '12px 24px', fontSize: '14px' }}
              >
                Open Workspace Dashboard <IconArrowRight size={14} color="#EDE2D0" />
              </button>
              <button
                onClick={() => navigate('/verify/sample')}
                className="btn-signet-secondary"
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  background: 'rgba(237, 226, 208, 0.05)',
                  color: '#EDE2D0',
                  borderColor: 'rgba(237, 226, 208, 0.18)',
                }}
              >
                Audit Sample Dossier
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
