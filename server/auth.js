import jwt from 'jsonwebtoken'

export const COOKIE_NAME = 'itball2_token'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET || JWT_SECRET.length < 16) {
  console.warn(
    '[auth] Set JWT_SECRET in .env (min 16 chars). Using insecure dev default.',
  )
}
const SECRET = JWT_SECRET ?? 'dev-only-insecure-jwt-secret-change-me-32ch'

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d'

/**
 * @param {{ id: number, email: string, firstName: string, lastName: string }} user
 */
export function signUserToken(user) {
  return jwt.sign(
    {
      sub: Number(user.id),
      role: 'user',
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )
}

/**
 * @param {{ username: string, displayName: string }} admin
 */
export function signAdminToken(admin) {
  return jwt.sign(
    {
      sub: 'super_admin',
      role: 'super_admin',
      username: admin.username,
      displayName: admin.displayName,
    },
    SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET)
}

export function cookieOptions() {
  const secure = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

export function clearCookieOptions() {
  const secure = process.env.NODE_ENV === 'production'
  return { path: '/', sameSite: 'lax', secure }
}

export function attachUser(req, _res, next) {
  req.user = undefined
  try {
    const raw =
      req.cookies?.[COOKIE_NAME] ||
      req.headers.authorization?.replace(/^Bearer\s+/i, '')
    if (!raw) return next()
    req.user = verifyToken(raw)
  } catch {
    req.user = undefined
  }
  next()
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

export function requireSuperAdmin(req, res, next) {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}

/** Registered customers only (not super admin). Orders reference `users.id`. */
export function requireCustomer(req, res, next) {
  if (req.user?.role !== 'user') {
    return res.status(403).json({
      error:
        'Only customer accounts can place orders. Sign in with a registered email.',
    })
  }
  next()
}
