const disclosures = [
  {
    q: 'what actually gets recorded',
    a: 'Contributor address, repo, PR number, and merge timestamp. Nothing about code quality.',
  },
  {
    q: 'who can mint a badge',
    a: 'Only the listener service, triggered by a verified webhook. Your wallet only ever signs a free message — the backend covers every on-chain write, making it completely free for contributors.',
  },
  {
    q: "why it can't be transferred",
    a: "The contract's transfer function reverts, provably, on-chain.",
  },
  {
    q: 'how to verify a claim',
    a: 'Every badge links to its transaction on the explorer — that link is the real source of truth.',
  },
  {
    q: "what this doesn't claim",
    a: 'No code quality judgment, no mainnet yet. Proof that a merge happened, nothing more.',
  },
]

export default function HowItWorks() {
  return (
    <div className="container how-page">
      <div className="how-header">
        <div className="how-title">The trust model, plainly</div>
        <div className="how-sub">Five honest answers, no marketing.</div>
      </div>

      <div className="disclosure-list">
        {disclosures.map((d) => (
          <div key={d.q} className="disclosure-item" id={`disclosure-${d.q.replace(/\s+/g, '-')}`}>
            <div className="disclosure-q">{d.q}</div>
            <div className="disclosure-a">{d.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
