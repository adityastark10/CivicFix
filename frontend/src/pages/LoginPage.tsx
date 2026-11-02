import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormData {
  phone: string
  password: string
}

interface FormErrors {
  phone?: string
  password?: string
  general?: string
}

// ── Validation ────────────────────────────────────────────────────────────────
function validate(form: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Enter a valid 10-digit mobile number'
  }
  if (!form.password) {
    errors.password = 'Password is required'
  }
  return errors
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm]               = useState<FormData>({ phone: '', password: '' })
  const [errors, setErrors]           = useState<FormErrors>({})
  const [loading, setLoading]         = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      /**
       * POST /api/auth/login
       * Body    : { phone, password }
       * Response: { message, token, user }
       */
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone:    form.phone.replace(/\s/g, ''),
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.message || 'Login failed. Please try again.' })
        return
      }

      // ── Persist session ───────────────────────────────────────────────────
      localStorage.setItem('cf_token', data.token)
      localStorage.setItem('cf_user',  JSON.stringify(data.user))

      navigate('/dashboard', { replace: true })

    } catch {
      setErrors({ general: 'Network error. Please check your connection and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cf-page">
      <div className="cf-card">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="cf-header">
          <div className="cf-logo-icon">🌿</div>
          <div>
            <h1 className="cf-brand">Welcome back</h1>
            <p className="cf-subtext">Login to your CivicFix account</p>
          </div>
        </div>

        {/* ── General error banner ───────────────────────────────────────── */}
        {errors.general && <div className="cf-alert">{errors.general}</div>}

        <form onSubmit={handleSubmit} noValidate>

          <p className="cf-section-label">YOUR CREDENTIALS</p>

          {/* ── Phone ────────────────────────────────────────────────────── */}
          <div className="cf-field">
            <label className="cf-label">Phone number</label>
            <div className={`cf-phone-wrap ${errors.phone ? 'cf-phone-error' : ''}`}>
              <span className="cf-phone-prefix">+91</span>
              <input
                className="cf-input cf-input-phone"
                type="tel"
                name="phone"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                autoComplete="tel"
                autoFocus
              />
            </div>
            {errors.phone && <span className="cf-error">{errors.phone}</span>}
          </div>

          {/* ── Password ─────────────────────────────────────────────────── */}
          <div className="cf-field">
            <label className="cf-label">Password</label>
            <div className={`cf-pw-wrap ${errors.password ? 'cf-pw-error' : ''}`}>
              <input
                className="cf-input cf-input-pw"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="cf-pw-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="cf-error">{errors.password}</span>}
          </div>

          {/* ── Submit ───────────────────────────────────────────────────── */}
          <button
            type="submit"
            className="cf-btn cf-btn-full"
            disabled={loading}
          >
            {loading
              ? <span className="cf-spinner">Logging in…</span>
              : 'Login'}
          </button>
        </form>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <p className="cf-footer">
          Don't have an account?{' '}
          <Link to="/register" className="cf-link">Register here</Link>
        </p>
      </div>
    </div>
  )
}
