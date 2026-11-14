import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getAttestations } from '../lib/contract'
import api from '../lib/api'
import { fetchGitHubUserStats, type GitHubStats } from '../lib/github'
import ThemeToggle from '../components/ThemeToggle'
import { IconShield } from '../components/Icons'

export default function CredentialDetailPage() {
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ghStats, setGhStats] = useState(null)

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
            issueTimestamp: att.issueTimestamp || att.mergeTimestamp,
          })
          if (att.githubUsername) {
            setGhStats(await fetchGitHubUserStats(att.githubUsername))
          }
        } else {
          const resolved = await api.resolveWallet(tokenId)
          if (resolved) {
            setData({
              tokenId: Number(tokenId),
              repo: resolved.repo || '',
              prNumber: resolved.prNumber || 0,
              prTitle: resolved.prTitle || '',
              githubUsername: resolved.githubUsername,
              mergeCommitSha: resolved.mergeCommitSha,
              contributor: resolved.contributor || '',
              mergeTimestamp: resolved.mergeTimestamp || 0,
              txHash: resolved.txHash || '',
              network: resolved.network || 'NEAR',
              category: resolved.category || 'OSS Contribution',
              issuer: resolved.issuer || 'GitHub',
              issueTimestamp: resolved.issueTimestamp || 0,
            })
            setGhStats(await fetchGitHubUserStats(resolved.githubUsername || ''))
          } else {
            setError('Credential not found')
          }
        }
      } catch (err) {
        try {
          const resolved = await api.resolveWallet(tokenId)
          if (resolved) {
            setData({
              tokenId: Number(tokenId),
              repo: resolved.repo || '',
              prNumber: resolved.prNumber || 0,
              prTitle: resolved.prTitle || '',
              githubUsername: resolved.githubUsername,
              mergeCommitSha: resolved.mergeCommitSha,
              contributor: resolved.contributor || '',
              mergeTimestamp: resolved.mergeTimestamp || 0,
              txHash: resolved.txHash || '',
              network: resolved.network || 'NEAR',
              category: resolved.category || 'OSS Contribution',
              issuer: resolved.issuer || 'GitHub',
              issueTimestamp: resolved.issueTimestamp || 0,
            })
            setGhStats(await fetchGitHubUserStats(resolved.githubUsername || ''))
          } else {
            setError('Credential not found')
          }
        } catch (err2) {
          setError('Unable to load credential')
        }
      }
      setLoading(false)
    })()
  }, [tokenId])

  if (loading) {
    return <div>Loading credential...</div>
  }
  if (error) {
    return <div style={{ padding: '2rem' }}>Error: {error}</div>
  }
  if (!data) {
    return <div>No credential data</div>
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
        <div>{data.githubUsername ? `@{data.githubUsername}` : data.contributor}</div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--stamp)' }}>Transaction Hash</div>
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: 6, padding: '0.5rem', fontFamily: 'monospace', color: 'var(--ink)', wordBreak: 'break-all' }}>
          {data.txHash.substring(0, 6)}...{data.txHash.substring(-6)}
        </div>
      </div>
    </div>
  )
}