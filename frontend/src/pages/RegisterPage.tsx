import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './RegisterPage.css'

// ── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  firstName: string
  lastName: string
  phone: string
  aadhaar: string
  municipalityType: 'urban' | 'rural' | ''
  municipality: string
  ward: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  phone?: string
  aadhaar?: string
  municipalityType?: string
  municipality?: string
  ward?: string
  password?: string
  confirmPassword?: string
  general?: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const URBAN_MUNICIPALITIES = [
  'Ahmedabad Municipal Corporation',
  'Bengaluru Bruhat Mahanagara Palike',
  'Brihanmumbai Municipal Corporation',
  'Chennai Corporation',
  'Delhi Municipal Corporation',
  'Greater Hyderabad Municipal Corporation',
  'Kolkata Municipal Corporation',
  'Pune Municipal Corporation',
]

const RURAL_MUNICIPALITIES = [
  'Alwar Gram Panchayat',
  'Bhiwadi Nagar Panchayat',
  'Chittorgarh Panchayat Samiti',
  'Dungarpur Gram Panchayat',
  'Etah Gram Panchayat',
]

// ── Validation helpers ────────────────────────────────────────────────────────
function validate(form: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!form.firstName.trim()) errors.firstName = 'First name is required'
  if (!form.lastName.trim()) errors.lastName = 'Last name is required'

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Enter a valid 10-digit mobile number'
  }

  if (!form.aadhaar.trim()) {
    errors.aadhaar = 'Aadhaar number is required'
  } else if (!/^\d{12}$/.test(form.aadhaar.replace(/\s/g, ''))) {
    errors.aadhaar = 'Aadhaar must be 12 digits'
  }

  if (!form.municipalityType) errors.municipalityType = 'Please select Urban or Rural'
  if (!form.municipality.trim()) errors.municipality = 'Please select your municipality'
  if (!form.ward.trim()) errors.ward = 'Ward number is required'

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    aadhaar: '',
    municipalityType: '',
    municipality: '',
    ward: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const municipalities =
    form.municipalityType === 'urban'
      ? URBAN_MUNICIPALITIES
      : form.municipalityType === 'rural'
      ? RURAL_MUNICIPALITIES
      : []

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // clear the error for this field on change
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function handleMunicipalityType(type: 'urban' | 'rural') {
    setForm((prev) => ({ ...prev, municipalityType: type, municipality: '', ward: '' }))
    setErrors((prev) => ({ ...prev, municipalityType: undefined }))
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
       * POST /api/auth/register
       * Body: { firstName, lastName, phone, aadhaar,
       *         municipalityType, municipality, ward, password }
       */
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.replace(/\s/g, ''),
          aadhaar: form.aadhaar.replace(/\s/g, ''),
          municipalityType: form.municipalityType,
          municipality: form.municipality,
          ward: form.ward.trim(),
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.message || 'Registration failed. Please try again.' })
        return
      }

      setSuccess(true)
      // Redirect to login after 1.5s
      setTimeout(() => navigate('/login'), 1500)
    } catch {
      setErrors({ general: 'Network error. Please check your connection.' })
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="cf-page">
        <div className="cf-card cf-success">
          <div className="cf-logo-wrap">
            <div className="cf-logo-icon">✓</div>
          </div>
          <h2>Account Created!</h2>
          <p>Welcome to CivicFix, {form.firstName}. You can now log in.</p>
          <Link to="/login" className="cf-btn cf-btn-full">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  // ── Register form ───────────────────────────────────────────────────────────
  return (
    <div className="cf-page">
      <div className="cf-card">
        {/* Header */}
        <div className="cf-header">
          <div className="cf-logo-icon">🌿</div>
          <div>
            <h1 className="cf-brand">Join CivicFix</h1>
            <p className="cf-subtext">Create your citizen account</p>
          </div>
        </div>

        {errors.general && <div className="cf-alert">{errors.general}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Personal Information ─────────────────────────────────── */}
          <p className="cf-section-label">PERSONAL INFORMATION</p>

          <div className="cf-row">
            <div className="cf-field">
              <label className="cf-label">Legal first name</label>
              <input
                className={`cf-input ${errors.firstName ? 'cf-input-error' : ''}`}
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />
              {errors.firstName && <span className="cf-error">{errors.firstName}</span>}
            </div>
            <div className="cf-field">
              <label className="cf-label">Last name</label>
              <input
                className={`cf-input ${errors.lastName ? 'cf-input-error' : ''}`}
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />
              {errors.lastName && <span className="cf-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="cf-field">
            <label className="cf-label">Phone number</label>
            <div className="cf-phone-wrap">
              <span className="cf-phone-prefix">+91</span>
              <input
                className={`cf-input cf-input-phone ${errors.phone ? 'cf-input-error' : ''}`}
                type="tel"
                name="phone"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                autoComplete="tel"
              />
            </div>
            {errors.phone && <span className="cf-error">{errors.phone}</span>}
          </div>

          <div className="cf-field">
            <label className="cf-label">Aadhaar number</label>
            <input
              className={`cf-input ${errors.aadhaar ? 'cf-input-error' : ''}`}
              type="text"
              name="aadhaar"
              placeholder="Enter Aadhaar number"
              value={form.aadhaar}
              onChange={handleChange}
              maxLength={12}
            />
            {errors.aadhaar && <span className="cf-error">{errors.aadhaar}</span>}
          </div>

          {/* ── Location Information ─────────────────────────────────── */}
          <p className="cf-section-label cf-section-gap">LOCATION INFORMATION</p>

          <div className="cf-field">
            <label className="cf-label">Municipality type</label>
            <div className="cf-toggle-group">
              <button
                type="button"
                className={`cf-toggle ${form.municipalityType === 'urban' ? 'cf-toggle-active' : ''}`}
                onClick={() => handleMunicipalityType('urban')}
              >
                Urban
              </button>
              <button
                type="button"
                className={`cf-toggle ${form.municipalityType === 'rural' ? 'cf-toggle-active' : ''}`}
                onClick={() => handleMunicipalityType('rural')}
              >
                Rural
              </button>
            </div>
            {errors.municipalityType && (
              <span className="cf-error">{errors.municipalityType}</span>
            )}
          </div>

          <div className="cf-field">
            <label className="cf-label">Municipality / local authority</label>
            <select
              className={`cf-input cf-select ${errors.municipality ? 'cf-input-error' : ''}`}
              name="municipality"
              value={form.municipality}
              onChange={handleChange}
              disabled={!form.municipalityType}
            >
              <option value="">Select your municipality</option>
              {municipalities.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.municipality && <span className="cf-error">{errors.municipality}</span>}
          </div>

          <div className="cf-field">
            <label className="cf-label">Ward number</label>
            <input
              className={`cf-input ${errors.ward ? 'cf-input-error' : ''}`}
              type="text"
              name="ward"
              placeholder="Select or enter ward number"
              value={form.ward}
              onChange={handleChange}
            />
            {errors.ward && <span className="cf-error">{errors.ward}</span>}
          </div>

          {/* ── Account Security ─────────────────────────────────────── */}
          <p className="cf-section-label cf-section-gap">ACCOUNT SECURITY</p>

          <div className="cf-field">
            <label className="cf-label">Create password</label>
            <input
              className={`cf-input ${errors.password ? 'cf-input-error' : ''}`}
              type="password"
              name="password"
              placeholder="Create a secure password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <span className="cf-error">{errors.password}</span>}
          </div>

          <div className="cf-field">
            <label className="cf-label">Retype password</label>
            <input
              className={`cf-input ${errors.confirmPassword ? 'cf-input-error' : ''}`}
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="cf-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="cf-btn cf-btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="cf-footer">
          Already registered?{' '}
          <Link to="/login" className="cf-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

