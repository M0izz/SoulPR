import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAttestations } from '../lib/contract'
import api from '../lib/api'
import { fetchGitHubUserStats } from '../lib/github'

interface CredentialData {
  tokenId: number | string
  repo: string
  prNumber: number
  prTitle: string
  githubUsername?: string
  mergeCommitSha?: string
  contributor: string
  mergeTimestamp: number
  txHash: string
  network: string
  category: string
  issuer: string
  issueTimestamp: number
}

export default function CredentialDetailPage() {
  const { tokenId } = useParams()
  const [data, setData] = useState<CredentialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userFollowers, setUserFollowers] = useState<number | null>(null)

  useEffect(() => {
    if (!tokenId) {
      setError('No credential ID')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const attestations = await getAttestations(tokenId)
        if (attestations && attestations.length > 0) {
          const att = attestations[0]
          setData({
            tokenId: att.tokenId,
            repo: att.repo,
            prNumber: att.prNumber,
            prTitle: att.prTitle || 'OSS Contribution',
            githubUsername: att.githubUsername,
            mergeCommitSha: att.mergeCommitSha,
            contributor: att.contributor,
            mergeTimestamp: att.mergeTimestamp,
            txHash: att.txHash || '',
            network: 'NEAR testnet',
            category: 'OSS Contribution',
            issuer: 'GitHub',
            issueTimestamp: att.mergeTimestamp,
          })
          if (att.githubUsername) {
            const stats = await fetchGitHubUserStats(att.githubUsername)
            if (stats) setUserFollowers(stats.followers)
          }
        } else {
          const resolved = await api.resolveWallet(tokenId)
          if (resolved) {
            setData({
              tokenId: Number(tokenId),
              repo: (resolved as any).repo || '',
              prNumber: (resolved as any).prNumber || 0,
              prTitle: (resolved as any).prTitle || '',
              githubUsername: (resolved as any).githubUsername,
              mergeCommitSha: (resolved as any).mergeCommitSha,
              contributor: (resolved as any).contributor || '',
              mergeTimestamp: (resolved as any).mergeTimestamp || 0,
              txHash: (resolved as any).txHash || '',
              network: (resolved as any).network || 'NEAR',
              category: (resolved as any).category || 'OSS Contribution',
              issuer: (resolved as any).issuer || 'GitHub',
              issueTimestamp: (resolved as any).issueTimestamp || 0,
            })
            if ((resolved as any).githubUsername) {
              const stats = await fetchGitHubUserStats((resolved as any).githubUsername)
              if (stats) setUserFollowers(stats.followers)
            }
          } else {
            setError('Credential not found')
          }
        }
      } catch {
        try {
          const resolved = await api.resolveWallet(tokenId)
          if (resolved) {
            setData({
              tokenId: Number(tokenId),
              repo: (resolved as any).repo || '',
              prNumber: (resolved as any).prNumber || 0,
              prTitle: (resolved as any).prTitle || '',
              githubUsername: (resolved as any).githubUsername,
              mergeCommitSha: (resolved as any).mergeCommitSha,
              contributor: (resolved as any).contributor || '',
              mergeTimestamp: (resolved as any).mergeTimestamp || 0,
              txHash: (resolved as any).txHash || '',
              network: (resolved as any).network || 'NEAR',
              category: (resolved as any).category || 'OSS Contribution',
              issuer: (resolved as any).issuer || 'GitHub',
              issueTimestamp: (resolved as any).issueTimestamp || 0,
            })
            if ((resolved as any).githubUsername) {
              const stats = await fetchGitHubUserStats((resolved as any).githubUsername)
              if (stats) setUserFollowers(stats.followers)
            }
          } else {
            setError('Credential not found')
          }
        } catch {
          setError('Unable to load credential')
        }
      }
      setLoading(false)
    })()
  }, [tokenId])

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading credential...</div>
  }
  if (error) {
    return <div style={{ padding: '2rem' }}>Error: {error}</div>
  }
  if (!data) {
    return <div style={{ padding: '2rem' }}>No credential data</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" style={{ color: 'var(--ink)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          ← Back to Dashboard
        </Link>
        <span style={{ marginLeft: '2rem' }}>Credential #{data.tokenId}</span>
      </div>
      <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: 12, padding: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--stamp)' }}>Category</div>
          <div>{data.category}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--stamp)' }}>Issuer</div>
          <div>{data.issuer}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--stamp)' }}>Issued</div>
          <div>{new Date(data.issueTimestamp * 1000).toDateString()}</div>
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--stamp)' }}>Contributor</div>
        <div>{data.githubUsername ? `@${data.githubUsername}` : data.contributor}</div>
        {userFollowers !== null && (
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>GitHub Followers: {userFollowers}</div>
        )}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--stamp)' }}>Transaction Hash</div>
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: 6, padding: '0.5rem', fontFamily: 'monospace', color: 'var(--ink)', wordBreak: 'break-all' }}>
          {data.txHash ? `${data.txHash.slice(0, 6)}...${data.txHash.slice(-6)}` : 'Awaiting Settlement'}
        </div>
      </div>
    </div>
  )
}
