import { useState, useEffect } from 'react'
import api from '../lib/api'

interface RepoItem {
  fullName: string
  tracked: boolean
}

export default function Install() {
  const [repos, setRepos] = useState<RepoItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  // 1. Fetch tracked repos list on mount
  useEffect(() => {
    const loadRepos = async () => {
      try {
        const data = await api.getTrackedRepos()
        setRepos(data.repos)
      } catch (err: any) {
        console.error('[Install] Failed to load repositories:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadRepos()
  }, [])

  function toggleRepo(fullName: string) {
    setSaved(false)
    setRepos((prev) =>
      prev.map((r) => r.fullName === fullName ? { ...r, tracked: !r.tracked } : r)
    )
  }

  async function saveChanges() {
    setSaving(true)
    try {
      const trackedList = repos.filter((r) => r.tracked).map((r) => r.fullName)
      await api.saveTrackedRepos(trackedList)
      setSaved(true)
    } catch (err: any) {
      console.error('[Install] Failed to save tracked repos:', err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container install-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <span className="spinner" />
      </div>
    )
  }

  return (
    <div className="container install-page">
      <div className="install-header">
        <div className="install-title">Add a repository</div>
        <div className="install-sub">Install the GitHub App, then choose repos to track.</div>
      </div>

      {/* GitHub App status */}
      <div className="app-status-row">
        <span style={{ fontSize: 20 }}>⌥</span>
        <span className="app-status-label">GitHub App</span>
        <span className="status-badge status-installed">installed</span>
      </div>

      {/* Repo list */}
      <div className="repos-label">Tracked repositories</div>
      <div className="repo-list">
        {repos.map((repo) => (
          <div
            key={repo.fullName}
            className="repo-row"
            onClick={() => toggleRepo(repo.fullName)}
            id={`repo-row-${repo.fullName.replace('/', '-')}`}
          >
            <div className={`repo-checkbox ${repo.tracked ? 'checked' : ''}`}>
              {repo.tracked && (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="repo-name">{repo.fullName}</span>
          </div>
        ))}
      </div>

      <button
        id="save-repos-btn"
        className="btn btn-primary"
        onClick={saveChanges}
        disabled={saving}
      >
        {saving ? <><span className="spinner" /> Saving…</> : saved ? '✓ Saved' : 'Save changes'}
      </button>
    </div>
  )
}
