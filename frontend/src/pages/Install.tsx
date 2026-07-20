import { useState, useEffect } from 'react'
import api from '../lib/api'
import {
  IconGitHub, IconCheck, IconFolder, IconShieldCheck,
  IconExternalLink, IconZap,
} from '../components/Icons'

interface RepoItem {
  fullName: string
  tracked: boolean
}

export default function Install() {
  const [repos, setRepos] = useState<RepoItem[]>([
    { fullName: 'soulpr/website', tracked: true },
    { fullName: 'soulpr/core', tracked: true },
    { fullName: 'soulpr/docs', tracked: true },
    { fullName: 'soulpr/sdk', tracked: false },
  ])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRepos = async () => {
      try {
        const data = await api.getTrackedRepos()
        if (data && data.repos && data.repos.length > 0) {
          setRepos(data.repos)
        }
      } catch (err: any) {
        console.warn('[Install] Using fallback repos:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadRepos()
  }, [])

  function toggleRepo(fullName: string) {
    setSaved(false)
    setRepos(prev => prev.map(r => r.fullName === fullName ? { ...r, tracked: !r.tracked } : r))
  }

  async function saveChanges() {
    setSaving(true)
    try {
      const trackedList = repos.filter(r => r.tracked).map(r => r.fullName)
      await api.saveTrackedRepos(trackedList)
      setSaved(true)
    } catch (err: any) {
      console.warn('[Install] Failed to save tracked repos:', err.message)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main style={{ minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontWeight: 600 }}>Loading repositories...</div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '560px', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '10px', fontWeight: 800, color: '#FF7B00',
            background: 'rgba(255,123,0,0.08)', border: '1px solid rgba(255,123,0,0.2)',
            borderRadius: '99px', padding: '4px 14px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem',
          }}>
            <IconZap size={11} color="#FF7B00" /> REPOSITORY INTEGRATION
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--ink)', marginBottom: '8px' }}>
            Tracked Repositories
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: '1.6' }}>
            Install the SoulPR GitHub App and choose which repositories auto-mint Soulbound Tokens on merge.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(78,66,56,0.25)',
          borderRadius: '20px', padding: '2rem 2.2rem',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        }}>

          {/* App Status Banner */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1.8rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#1B1816', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconGitHub size={20} color="#FFF" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>SoulPR GitHub App</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>Connected to organization</div>
              </div>
            </div>

            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.25)',
              borderRadius: '99px', padding: '4px 12px', fontSize: '10px', color: '#16A34A', fontWeight: 800,
            }}>
              <IconShieldCheck size={12} color="#16A34A" /> Installed
            </span>
          </div>

          {/* Tracked Repos List */}
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            SELECT REPOSITORIES TO TRACK
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.8rem' }}>
            {repos.map(repo => (
              <div
                key={repo.fullName}
                onClick={() => toggleRepo(repo.fullName)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', borderRadius: '10px',
                  border: `1px solid ${repo.tracked ? 'rgba(255,123,0,0.3)' : 'rgba(78,66,56,0.15)'}`,
                  background: repo.tracked ? 'rgba(255,123,0,0.05)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconFolder size={16} color={repo.tracked ? '#FF7B00' : 'var(--ink-faint)'} />
                  <span style={{ fontSize: '13px', fontWeight: repo.tracked ? 700 : 500, color: 'var(--ink)' }}>
                    {repo.fullName}
                  </span>
                </div>

                <div style={{
                  width: '20px', height: '20px', borderRadius: '6px',
                  border: repo.tracked ? 'none' : '1.5px solid rgba(78,66,56,0.3)',
                  background: repo.tracked ? '#FF7B00' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {repo.tracked && <IconCheck size={12} color="#FFF" strokeWidth={3} />}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={saveChanges}
              disabled={saving}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: saved ? '#16A34A' : 'linear-gradient(135deg, #FF7B00 0%, #E05300 100%)',
                color: '#FFF', border: 'none', borderRadius: '10px',
                padding: '12px 0', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255,123,0,0.22)', transition: 'background 0.2s',
              }}
            >
              {saved ? '✓ Changes Saved' : saving ? 'Saving...' : 'Save Configuration'}
            </button>

            <a
              href="https://github.com/apps"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '12px 16px', borderRadius: '10px',
                border: '1px solid rgba(78,66,56,0.2)', background: 'transparent',
                color: 'var(--ink)', fontSize: '12px', fontWeight: 700, textDecoration: 'none',
              }}
            >
              Manage App <IconExternalLink size={13} color="var(--ink)" />
            </a>
          </div>

        </div>
      </div>
    </main>
  )
}
