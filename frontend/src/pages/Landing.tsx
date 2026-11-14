import { useNavigate } from 'react-router-dom'
import LandingNav from '../components/nav/LandingNav'
import SignetHero from '../components/hero/SignetHero'
import ProductWalkthrough from '../components/walkthrough/ProductWalkthrough'
import HolographicCredential3D from '../components/credential/HolographicCredential3D'
import SignetFooter from '../components/layout/SignetFooter'
import SignetInsignia from '../components/brand/SignetInsignia'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        backgroundColor: '#10100F',
        color: '#EDE2D0',
        minHeight: '100vh',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ── Navigation ── */}
      <LandingNav />

      <main>
        {/* ── SECTION 1: Cinematic Hero ── */}
        <SignetHero />

        {/* ── SECTION 2: The Problem (Warm Cream #F3E8D5) ── */}
        <section
          id="problem"
          style={{
            backgroundColor: '#F3E8D5',
            color: '#191715',
            padding: '6rem 2rem 6.5rem',
            borderTop: '1px solid rgba(118, 103, 91, 0.25)',
          }}
          aria-labelledby="problem-headline"
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.05fr 0.95fr',
                gap: '4rem',
                alignItems: 'center',
              }}
              className="editorial-split-grid"
            >
              {/* Text Narrative */}
              <div style={{ textAlign: 'left' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: '#B9572B',
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  The Nature of Contribution
                </span>
                <h2
                  id="problem-headline"
                  className="signet-headline"
                  style={{
                    fontSize: 'clamp(34px, 4vw, 50px)',
                    fontWeight: 500,
                    lineHeight: 1.15,
                    marginBottom: '1.4rem',
                    color: '#191715',
                  }}
                >
                  Your work deserves to outlive the moment.
                </h2>
                <p
                  style={{
                    fontSize: '16.5px',
                    lineHeight: 1.75,
                    color: 'var(--signet-muted)',
                    marginBottom: '1.4rem',
                  }}
                >
                  Valuable engineering contributions exist scattered across repositories, pull requests,
                  organisations, and disconnected platforms. While the work exists in git history, its context
                  is frequently lost, its significance difficult to articulate, and its underlying evidence
                  cumbersome for peers, reviewers, or recruiters to inspect.
                </p>
                <p
                  style={{
                    fontSize: '15.5px',
                    lineHeight: 1.7,
                    color: '#191715',
                    fontWeight: 500,
                  }}
                >
                  Resumes rely on self-reported assertions. Portfolios fade. Meaningful contributions deserve
                  a structured, durable record connected directly to its inspectable source proof.
                </p>
              </div>

              {/* Fragmented Contribution Archive Visual */}
              <div
                style={{
                  position: 'relative',
                  minHeight: '340px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Fragmented repository records"
              >
                {/* Fragment 1: PR Record Card */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '20px',
                    width: '280px',
                    backgroundColor: '#FFF',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(118, 103, 91, 0.22)',
                    transform: 'rotate(-4deg)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--signet-muted)', marginBottom: '4px' }}>
                    github.com/rust-lang/cargo · PR #11402
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#191715' }}>
                    Fix resolver lockfile backtracking logic
                  </div>
                  <div style={{ fontSize: '10px', color: '#2A7D4F', fontWeight: 600, marginTop: '6px' }}>
                    Merged into master · 3 comments
                  </div>
                </div>

                {/* Fragment 2: Orphaned Commit Object */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '15px',
                    width: '260px',
                    backgroundColor: '#FFF',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(118, 103, 91, 0.22)',
                    transform: 'rotate(3.5deg)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#B9572B', fontWeight: 700, marginBottom: '4px' }}>
                    COMMIT 9c8f1e2a
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '12px', color: '#191715' }}>
                    Refactor peer connection retry loop
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--signet-muted)', marginTop: '4px' }}>
                    Disconnected from author profile
                  </div>
                </div>

                {/* Fragment 3: Central scattered git diff badge */}
                <div
                  style={{
                    backgroundColor: '#191715',
                    color: '#EDE2D0',
                    borderRadius: '8px',
                    padding: '12px 18px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.25)',
                    transform: 'translateY(-10px)',
                    zIndex: 2,
                    textAlign: 'left',
                  }}
                >
                  <div style={{ color: '#B9572B', fontWeight: 700, marginBottom: '2px' }}>
                    evidence_status: fragmented
                  </div>
                  <div>origin: 14 distinct repositories</div>
                  <div style={{ color: 'rgba(237, 226, 208, 0.5)' }}>context: unpreserved</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: The Solution (Charcoal #191715) ── */}
        <section
          id="protocol"
          style={{
            backgroundColor: '#191715',
            color: '#EDE2D0',
            padding: '6.5rem 2rem 7rem',
            borderTop: '1px solid rgba(237, 226, 208, 0.08)',
          }}
          aria-labelledby="solution-headline"
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#B9572B',
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                The SIGNET Protocol Architecture
              </span>
              <h2
                id="solution-headline"
                className="signet-headline"
                style={{
                  fontSize: 'clamp(34px, 4vw, 50px)',
                  fontWeight: 500,
                  color: '#EDE2D0',
                  marginBottom: '1.2rem',
                }}
              >
                A lasting mark for meaningful work.
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--signet-muted)',
                  maxWidth: '640px',
                  margin: '0 auto',
                  lineHeight: 1.7,
                }}
              >
                SIGNET bridges the gap between open-source repositories and permanent attestation.
                By structuring contribution records into verifiable evidence, we turn scattered code into enduring credentials.
              </p>
            </div>

            {/* Three Pillar Convergence Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                textAlign: 'left',
              }}
              className="three-pillar-grid"
            >
              <div
                style={{
                  backgroundColor: '#141312',
                  border: '1px solid rgba(237, 226, 208, 0.1)',
                  borderRadius: '14px',
                  padding: '2.2rem 2rem',
                }}
              >
                <div style={{ color: '#B9572B', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  01. Evidence
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: '#EDE2D0', marginBottom: '10px' }}>
                  Identifiable Source Records
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--signet-muted)', lineHeight: 1.65 }}>
                  Every credential ties back to real, inspectable git evidence: commit hashes, pull request discussions,
                  code diff metrics, and maintainer signatures.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#141312',
                  border: '1px solid rgba(237, 226, 208, 0.1)',
                  borderRadius: '14px',
                  padding: '2.2rem 2rem',
                }}
              >
                <div style={{ color: '#B9572B', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  02. Verification
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: '#EDE2D0', marginBottom: '10px' }}>
                  Rigorous Inspection Process
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--signet-muted)', lineHeight: 1.65 }}>
                  Evidence is audited according to implemented SIGNET requirements.
                  A merged pull request is not proof by itself; validation establishes authenticity before attestation.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#141312',
                  border: '1px solid rgba(237, 226, 208, 0.1)',
                  borderRadius: '14px',
                  padding: '2.2rem 2rem',
                }}
              >
                <div style={{ color: '#B9572B', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  03. Credential
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: '#EDE2D0', marginBottom: '10px' }}>
                  Independently Inspectable
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--signet-muted)', lineHeight: 1.65 }}>
                  An issued credential stands on its own. Anyone can inspect its evidence trail without trusting a centralised
                  platform, private database, or proprietary API key.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: Interactive Product Walkthrough (Warm Cream) ── */}
        <ProductWalkthrough />

        {/* ── SECTION 5: Credential Showcase (Charcoal #191715) ── */}
        <section
          id="credentials"
          style={{
            backgroundColor: '#191715',
            color: '#EDE2D0',
            padding: '6.5rem 2rem 7rem',
            borderBottom: '1px solid rgba(237, 226, 208, 0.08)',
          }}
          aria-labelledby="showcase-headline"
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.05fr 0.95fr',
                gap: '4rem',
                alignItems: 'center',
              }}
              className="editorial-split-grid"
            >
              {/* Left Column: Narrative */}
              <div style={{ textAlign: 'left' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: '#B9572B',
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  Archival Digital Artifact
                </span>
                <h2
                  id="showcase-headline"
                  className="signet-headline"
                  style={{
                    fontSize: 'clamp(34px, 4vw, 50px)',
                    fontWeight: 500,
                    color: '#EDE2D0',
                    lineHeight: 1.15,
                    marginBottom: '1.4rem',
                  }}
                >
                  Not just a badge. A record worth inspecting.
                </h2>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'var(--signet-muted)',
                    lineHeight: 1.75,
                    marginBottom: '1.6rem',
                  }}
                >
                  SIGNET credentials avoid gamified achievement ribbons or speculative trading card aesthetics.
                  They are designed with archival luxury: tactile paper finishes, intaglio-engraved seals,
                  and precise tabular technical typography.
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#EDE2D0',
                    lineHeight: 1.7,
                    marginBottom: '2.5rem',
                  }}
                >
                  Every credential contains its complete provenance: recipient, contribution title, repository ID,
                  and deep evidence inspection references.
                </p>

                <button
                  onClick={() => navigate('/verify/sample')}
                  style={{
                    backgroundColor: 'var(--signet-orange)',
                    color: '#EDE2D0',
                    fontWeight: 700,
                    fontSize: '14.5px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(185, 87, 43, 0.3)',
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  Inspect sample credential →
                </button>
              </div>

              {/* Right Column: Floating Luxury Credential Card */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  perspective: '1000px',
                }}
              >
                <HolographicCredential3D
                  autoRotate={true}
                  showPedestal={true}
                  data={{
                    credentialId: 'SIG-2025-0426-001',
                    contributor: 'm0izz.testnet',
                    repository: 'm0izz/signet',
                    contributionTitle: 'Add evidence dossier support',
                    mergeDate: 'Apr 26, 2025 · 14:32 UTC',
                    network: 'NEAR Blockchain',
                    evidenceDigest: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
                    isSample: true,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: Who SIGNET Serves (Warm Cream #F3E8D5) ── */}
        <section
          id="audiences"
          style={{
            backgroundColor: '#F3E8D5',
            color: '#191715',
            padding: '6rem 2rem 6.5rem',
          }}
          aria-labelledby="audience-headline"
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#B9572B',
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                Connected Participants
              </span>
              <h2
                id="audience-headline"
                className="signet-headline"
                style={{
                  fontSize: 'clamp(34px, 4vw, 50px)',
                  fontWeight: 500,
                  color: '#191715',
                  marginBottom: '1rem',
                }}
              >
                Recognition that travels beyond the repository.
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--signet-muted)',
                  maxWidth: '640px',
                  margin: '0 auto',
                  lineHeight: 1.65,
                }}
              >
                Developers remain the central focus of SIGNET. Communities, maintainers, organizations,
                and reviewers form the surrounding ecosystem of verifiable recognition.
              </p>
            </div>

            {/* Audience Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5rem',
                textAlign: 'left',
              }}
              className="audience-four-grid"
            >
              <div style={{ backgroundColor: '#FAF3E7', borderRadius: '12px', padding: '1.8rem 1.6rem', border: '1px solid rgba(118, 103, 91, 0.22)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#B9572B', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Developers · Primary
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: '#191715', marginBottom: '8px' }}>
                  Preserve Your Legacy
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--signet-muted)', lineHeight: 1.6 }}>
                  Preserve and share a credible, permanent record of meaningful contributions across any public or private repository.
                </p>
              </div>

              <div style={{ backgroundColor: '#FAF3E7', borderRadius: '12px', padding: '1.8rem 1.6rem', border: '1px solid rgba(118, 103, 91, 0.22)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--signet-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Communities
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: '#191715', marginBottom: '8px' }}>
                  Recognise Builders
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--signet-muted)', lineHeight: 1.6 }}>
                  Strengthen your ecosystem by celebrating and attributing the actual contributors whose work powers your libraries.
                </p>
              </div>

              <div style={{ backgroundColor: '#FAF3E7', borderRadius: '12px', padding: '1.8rem 1.6rem', border: '1px solid rgba(118, 103, 91, 0.22)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--signet-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Maintainers & Orgs
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: '#191715', marginBottom: '8px' }}>
                  Structured Records
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--signet-muted)', lineHeight: 1.6 }}>
                  Create clear, verifiable credentials for contributors without adding administrative burden to pull request reviews.
                </p>
              </div>

              <div style={{ backgroundColor: '#FAF3E7', borderRadius: '12px', padding: '1.8rem 1.6rem', border: '1px solid rgba(118, 103, 91, 0.22)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--signet-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Reviewers & Recruiters
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: '#191715', marginBottom: '8px' }}>
                  Direct Source Proof
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--signet-muted)', lineHeight: 1.6 }}>
                  Inspect real contribution evidence and commit diffs instead of relying only on unverifiable resume assertions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: Technical Credibility (Deep Charcoal #10100F) ── */}
        <section
          id="technical"
          style={{
            backgroundColor: '#10100F',
            color: '#EDE2D0',
            padding: '6.5rem 2rem 7rem',
            borderTop: '1px solid rgba(237, 226, 208, 0.08)',
          }}
          aria-labelledby="tech-headline"
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#B9572B',
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                Protocol Integrity & Verification
              </span>
              <h2
                id="tech-headline"
                className="signet-headline"
                style={{
                  fontSize: 'clamp(34px, 4vw, 50px)',
                  fontWeight: 500,
                  color: '#EDE2D0',
                  marginBottom: '1.2rem',
                }}
              >
                A credential should be more than a claim.
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--signet-muted)',
                  maxWidth: '640px',
                  margin: '0 auto',
                  lineHeight: 1.7,
                }}
              >
                Behind every SIGNET credential is an inspectable verification pipeline connecting git state
                to on-chain cryptographic settlement.
              </p>
            </div>

            {/* Architecture Flow Diagram */}
            <div
              style={{
                backgroundColor: '#141312',
                border: '1px solid rgba(237, 226, 208, 0.1)',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '3rem',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '1rem',
                  alignItems: 'center',
                }}
                className="tech-flow-grid"
              >
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '10px', color: '#B9572B', fontWeight: 800, marginBottom: '4px' }}>STEP 1</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>GitHub Contribution</div>
                  <div style={{ fontSize: '11px', color: 'var(--signet-muted)', marginTop: '4px' }}>Merged PR webhook event</div>
                </div>

                <div style={{ textAlign: 'center', color: '#B9572B', fontSize: '18px' }}>→</div>

                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '10px', color: '#B9572B', fontWeight: 800, marginBottom: '4px' }}>STEP 2</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Evidence Extraction</div>
                  <div style={{ fontSize: '11px', color: 'var(--signet-muted)', marginTop: '4px' }}>Commit SHA, diffs & signatures</div>
                </div>

                <div style={{ textAlign: 'center', color: '#B9572B', fontSize: '18px' }}>→</div>

                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '10px', color: '#B9572B', fontWeight: 800, marginBottom: '4px' }}>STEP 3</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>NEAR Attestation</div>
                  <div style={{ fontSize: '11px', color: 'var(--signet-muted)', marginTop: '4px' }}>Non-transferable on-chain record</div>
                </div>
              </div>
            </div>

            {/* Technical Documentation Link Cards */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/how-it-works')}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: '#EDE2D0',
                  border: '1px solid rgba(237, 226, 208, 0.15)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Read Protocol Architecture FAQ →
              </button>

              <button
                onClick={() => navigate('/install')}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: '#EDE2D0',
                  border: '1px solid rgba(237, 226, 208, 0.15)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Track Repositories with GitHub App →
              </button>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: Final Call to Action (Deep Charcoal #10100F) ── */}
        <section
          style={{
            backgroundColor: '#10100F',
            color: '#EDE2D0',
            padding: '7rem 2rem 8rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          aria-labelledby="cta-headline"
        >
          {/* Subtle seal watermark in background */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.04,
              pointerEvents: 'none',
            }}
          >
            <SignetInsignia size={480} color="#B9572B" />
          </div>

          <div style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: '#B9572B',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Protocol Access
            </span>
            <h2
              id="cta-headline"
              className="signet-headline"
              style={{
                fontSize: 'clamp(38px, 5vw, 56px)',
                fontWeight: 500,
                marginBottom: '1.2rem',
                color: '#EDE2D0',
              }}
            >
              Make your mark.
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: 'var(--signet-muted)',
                lineHeight: 1.7,
                maxWidth: '580px',
                margin: '0 auto 2.5rem',
              }}
            >
              Your work deserves more than a place in repository history.
              Give it a lasting, verifiable record.
            </p>

            <button
              onClick={() => navigate('/auth')}
              style={{
                backgroundColor: 'var(--signet-orange)',
                color: '#EDE2D0',
                fontWeight: 800,
                fontSize: '16px',
                padding: '14px 34px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                boxShadow: '0 8px 24px rgba(185, 87, 43, 0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(185, 87, 43, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(185, 87, 43, 0.35)'
              }}
            >
              Create your SIGNET
            </button>
          </div>
        </section>
      </main>

      {/* ── SECTION 9: Minimal Editorial Footer ── */}
      <SignetFooter />

      <style>{`
        @media (max-width: 900px) {
          .editorial-split-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .three-pillar-grid {
            grid-template-columns: 1fr !important;
          }
          .audience-four-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .tech-flow-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .audience-four-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
