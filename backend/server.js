// ─────────────────────────────────────────────────────────────────────────────
//  server.js  –  CivicFix Express API
//  Stack: Node.js · Express · better-sqlite3 · bcryptjs · jsonwebtoken
// ─────────────────────────────────────────────────────────────────────────────
const express = require('express')
const cors    = require('cors')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const db      = require('./db')         // ← SQLite connection + schema

const app  = express()
const PORT = process.env.PORT || 3001

// ── Secret (put in .env before production) ───────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'civicfix_dev_secret_change_me'

// ─────────────────────────────────────────────────────────────────────────────
//  MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}))
app.use(express.json())

// Simple request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}]  ${req.method}  ${req.path}`)
  next()
})

// ─────────────────────────────────────────────────────────────────────────────
//  PREPARED STATEMENTS  (compiled once, reused on every call — fast & safe)
// ─────────────────────────────────────────────────────────────────────────────
const stmt = {
  // Register
  insertUser: db.prepare(`
    INSERT INTO users
      (id, first_name, last_name, phone, aadhaar,
       municipality_type, municipality, ward, password_hash)
    VALUES
      (@id, @firstName, @lastName, @phone, @aadhaar,
       @municipalityType, @municipality, @ward, @passwordHash)
  `),

  // Login / lookup
  findByPhone:    db.prepare('SELECT * FROM users WHERE phone = ?'),
  findById:       db.prepare('SELECT * FROM users WHERE id = ?'),

  // Stats
  countUsers:     db.prepare('SELECT COUNT(*) AS total FROM users'),
  listUsers:      db.prepare(
    'SELECT id, first_name, last_name, phone, municipality, created_at FROM users ORDER BY created_at DESC'
  ),
}

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Strip sensitive fields before sending user to client */
function safeUser(u) {
  if (!u) return null
  const { password_hash, aadhaar, ...safe } = u
  return {
    id:               safe.id,
    firstName:        safe.first_name,
    lastName:         safe.last_name,
    phone:            safe.phone,
    municipalityType: safe.municipality_type,
    municipality:     safe.municipality,
    ward:             safe.ward,
    createdAt:        safe.created_at,
  }
}

/** Middleware — verify JWT and attach req.user */
function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Authentication required.' })

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// ── Health ────────────────────────────────────────────────────────────────────
// GET /api/health
app.get('/api/health', (_req, res) => {
  const { total } = stmt.countUsers.get()
  res.json({ status: 'ok', database: 'SQLite (better-sqlite3)', totalUsers: total })
})

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
//  Body  : { firstName, lastName, phone, aadhaar,
//             municipalityType, municipality, ward, password }
//  201   : { message, user }
//  400   : validation error
//  409   : phone / aadhaar already registered
//  500   : server error
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      firstName, lastName, phone, aadhaar,
      municipalityType, municipality, ward, password,
    } = req.body

    // ── Field presence ────────────────────────────────────────────────────────
    if (!firstName || !lastName || !phone || !aadhaar ||
        !municipalityType || !municipality || !ward || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    // ── Format checks ─────────────────────────────────────────────────────────
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be exactly 10 digits.' })
    }
    if (!/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ message: 'Aadhaar must be exactly 12 digits.' })
    }
    if (!['urban', 'rural'].includes(municipalityType)) {
      return res.status(400).json({ message: 'Municipality type must be urban or rural.' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }

    // ── Duplicate check ───────────────────────────────────────────────────────
    const existing = stmt.findByPhone.get(phone)
    if (existing) {
      return res.status(409).json({ message: 'An account with this phone number already exists.' })
    }

    // ── Hash & insert ─────────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12)
    const id           = `CF-${Date.now()}`

    stmt.insertUser.run({
      id,
      firstName:        firstName.trim(),
      lastName:         lastName.trim(),
      phone,
      aadhaar,
      municipalityType,
      municipality:     municipality.trim(),
      ward:             ward.trim(),
      passwordHash,
    })

    const newUser = stmt.findById.get(id)
    console.log(`✅  Registered  [${id}]  ${firstName} ${lastName}  📞 ${phone}`)

    return res.status(201).json({
      message: 'Account created successfully.',
      user: safeUser(newUser),
    })

  } catch (err) {
    // UNIQUE constraint on aadhaar
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'Aadhaar number is already registered.' })
    }
    console.error('Register error:', err)
    return res.status(500).json({ message: 'Internal server error.' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
//  Body  : { phone, password }
//  200   : { message, token, user }
//  400   : missing fields
//  401   : wrong credentials
//  500   : server error
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required.' })
    }

    // ── Find user ─────────────────────────────────────────────────────────────
    const user = stmt.findByPhone.get(phone)
    if (!user) {
      // Don't reveal whether the phone exists
      return res.status(401).json({ message: 'Invalid phone number or password.' })
    }

    // ── Verify password ───────────────────────────────────────────────────────
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ message: 'Invalid phone number or password.' })
    }

    // ── Issue JWT ─────────────────────────────────────────────────────────────
    const token = jwt.sign(
      { id: user.id, phone: user.phone, municipality: user.municipality },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log(`🔑  Login  [${user.id}]  ${user.first_name} ${user.last_name}  📞 ${phone}`)

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: safeUser(user),
    })

  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal server error.' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/auth/me   (protected)
// ─────────────────────────────────────────────────────────────────────────────
//  Header: Authorization: Bearer <token>
//  200   : user profile (no password_hash, no aadhaar)
//  401   : not authenticated
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = stmt.findById.get(req.user.id)
  if (!user) return res.status(404).json({ message: 'User not found.' })
  return res.json(safeUser(user))
})

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/users   (protected – list all users, dev/admin use)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/users', requireAuth, (_req, res) => {
  const users = stmt.listUsers.all()
  return res.json({ total: users.length, users })
})

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' })
})

// ─────────────────────────────────────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║          CivicFix API  —  http://localhost:${PORT}         ║
╠══════════════════════════════════════════════════════╣
║  POST  /api/auth/register   Create account           ║
║  POST  /api/auth/login      Login → JWT              ║
║  GET   /api/auth/me         My profile  (🔒 JWT)     ║
║  GET   /api/users           All users   (🔒 JWT)     ║
║  GET   /api/health          Server health            ║
╚══════════════════════════════════════════════════════╝
`)
})
