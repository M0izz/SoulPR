export interface BadgeData {
  tokenId: number
  repo: string
  prNumber: number
  prTitle: string
  contributor: string
  mergeTimestamp: number
  txHash: string
  network: string
}

interface Props {
  badge: BadgeData
  onClose: () => void
}

const EXPLORER_BASE = 'https://testnet.monadexplorer.com/tx'

function formatDateTime(ts: number) {
  return new Date(ts * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function shortAddr(addr: string) {
  if (addr.length <= 13) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function BadgeDetailModal({ badge, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ position: 'relative' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Header */}
        <div className="modal-header">
          <div className="badge-icon badge-icon-lg">🏅</div>
          <div>
            <div className="modal-title">Contribution badge</div>
            <div className="modal-sub">soulbound, non-transferable</div>
          </div>
        </div>

        {/* Key-value details */}
        <div className="detail-rows">
          <div className="detail-row">
            <span className="detail-key">Repository</span>
            <span className="detail-val font-mono">{badge.repo}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Pull request</span>
            <span className="detail-val">#{badge.prNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Contributor</span>
            <span className="detail-val font-mono">{shortAddr(badge.contributor)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Merged</span>
            <span className="detail-val">{formatDateTime(badge.mergeTimestamp)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-key">Network</span>
            <span className="detail-val" style={{ color: 'var(--accent)' }}>{badge.network}</span>
          </div>
        </div>

        {/* Explorer link */}
        <a
          href={`${EXPLORER_BASE}/${badge.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          id={`explorer-link-${badge.tokenId}`}
        >
          <button className="btn btn-ghost btn-full">
            Verify on explorer ↗
          </button>
        </a>
      </div>
    </div>
  )
}
