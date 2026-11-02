import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './DashboardPage.css'

interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  municipalityType: string
  municipality: string
  ward: string
  createdAt: string
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser]     = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    const token     = localStorage.getItem('cf_token')
    const cachedUser = localStorage.getItem('cf_user')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    // Optimistically show cached user, then verify with server
    if (cachedUser) {
      setUser(JSON.parse(cachedUser))
      setLoading(false)
    }

    // Verify token & fetch fresh profile from DB
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          // Token expired
          localStorage.removeItem('cf_token')
          localStorage.removeItem('cf_user')
          navigate('/login', { replace: true })
          return
        }
        const data = await res.json()
        setUser(data)
        localStorage.setItem('cf_user', JSON.stringify(data))
      })
      .catch(() => setError('Could not refresh profile from server.'))
      .finally(() => setLoading(false))
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('cf_token')
    localStorage.removeItem('cf_user')
    navigate('/login', { replace: true })
  }

  if (loading && !user) {
    return (
      <div className="db-page">
        <div className="db-loader">Loading your profile…</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="db-page">
      <div className="db-card">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="db-header">
          <div className="db-avatar">
            {user.firstName.charAt(0).toUpperCase()}
            {user.lastName.charAt(0).toUpperCase()}
          </div>
          <div className="db-header-info">
            <h1 className="db-name">{user.firstName} {user.lastName}</h1>
            <span className={`db-badge db-badge-${user.municipalityType}`}>
              {user.municipalityType === 'urban' ? '🏙️ Urban' : '🌾 Rural'} citizen
            </span>
          </div>
          <button className="db-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {error && <div className="db-alert">{error}</div>}

        {/* ── Info grid ────────────────────────────────────────────────── */}
        <p className="db-section-label">ACCOUNT DETAILS</p>

        <div className="db-grid">
          <InfoCard label="Citizen ID"     value={user.id} />
          <InfoCard label="Phone"          value={`+91 ${user.phone}`} />
          <InfoCard label="Municipality"   value={user.municipality} />
          <InfoCard label="Ward"           value={user.ward} />
          <InfoCard
            label="Member since"
            value={new Date(user.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          />
          <InfoCard
            label="Account type"
            value={user.municipalityType.charAt(0).toUpperCase() + user.municipalityType.slice(1)}
          />
        </div>

        {/* ── Coming soon banner ───────────────────────────────────────── */}
        <div className="db-coming-soon">
          <span>🚧</span>
          <div>
            <strong>Dashboard features coming soon</strong>
            <p>Report civic issues, track complaints, and more.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="db-info-card">
      <span className="db-info-label">{label}</span>
      <span className="db-info-value">{value}</span>
    </div>
  )
}

