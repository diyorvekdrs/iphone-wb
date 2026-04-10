import { useState } from 'react'
import { apiRegister } from '../../api/client.js'
import { useAuth } from '../../hooks/useAuth.js'
import { passwordPolicyError } from '../../utils/passwordPolicy.js'

const field =
  'mt-1.5 w-full rounded-xl border border-black/[0.12] bg-white px-4 py-3 text-[17px] text-[#1d1d1f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/25'

const labelCls = 'text-[13px] font-medium text-[#1d1d1f]'

function RequiredMark() {
  return (
    <span className="text-[#bf4800]" aria-hidden="true">
      {' '}
      *
    </span>
  )
}

function formatMissingFieldsMessage(missing) {
  if (missing.length === 0) return ''
  return missing.length === 1
    ? `Please fill in ${missing[0]}.`
    : `Please fill in: ${missing.join(', ')}.`
}

/** Requires a local part, @, and a domain with at least one dot (e.g. name@example.com). */
function isValidEmail(value) {
  const s = String(value).trim()
  if (!s) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export default function RegisterPage() {
  const { refresh } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [matchError, setMatchError] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const missing = []
    if (!firstName.trim()) missing.push('First name')
    if (!lastName.trim()) missing.push('Last name')
    if (!email.trim()) missing.push('Email address')
    if (!password.trim()) missing.push('Password')
    if (!confirm.trim()) missing.push('Confirm password')
    if (missing.length) {
      setError(formatMissingFieldsMessage(missing))
      setMatchError(false)
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address (for example, name@example.com).')
      setMatchError(false)
      return
    }
    const pwErr = passwordPolicyError(password)
    if (pwErr) {
      setError(pwErr)
      setMatchError(false)
      return
    }
    if (password !== confirm) {
      setMatchError(true)
      setError('')
      return
    }
    if (!privacyAccepted) {
      setMatchError(false)
      setError('You need to accept the Privacy Policy to create an account.')
      return
    }
    if (!termsAccepted) {
      setMatchError(false)
      setError('You need to accept the Terms of Use to create an account.')
      return
    }
    setMatchError(false)
    setError('')
    setLoading(true)
    try {
      await apiRegister({ email, password, firstName, lastName })
      await refresh()
      window.location.hash = '#/'
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-11 text-[#1d1d1f]">
      <div className="mx-auto max-w-[420px] px-5 py-10 pb-20 md:px-6 md:py-14">
        <div className="rounded-[20px] border border-black/[0.06] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-10">
          <p className="text-center text-[13px] font-medium text-[#6e6e73]">
             Store
          </p>
          <h1 className="mt-2 text-center text-[28px] font-semibold leading-tight tracking-[-0.02em] md:text-[32px]">
            Create your account
          </h1>
          <p className="mt-2 text-center text-[15px] leading-snug text-[#6e6e73]">
            One Apple ID for the Store, iCloud, and more.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            {error ? (
              <p className="rounded-lg bg-[#fff3f0] px-3 py-2 text-[13px] text-[#bf4800]" role="alert">
                {error}
              </p>
            ) : null}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="reg-first" className={labelCls}>
                  First name
                  <RequiredMark />
                </label>
                <input
                  id="reg-first"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  aria-required="true"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={field}
                  placeholder="First name"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="reg-last" className={labelCls}>
                  Last name
                  <RequiredMark />
                </label>
                <input
                  id="reg-last"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  aria-required="true"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={field}
                  placeholder="Last name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className={labelCls}>
                Email address
                <RequiredMark />
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
                placeholder="name@example.com"
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                title="Enter an email address like name@example.com"
                required
                aria-required="true"
                aria-describedby="reg-email-hint"
                disabled={loading}
              />
              <p id="reg-email-hint" className="mt-1.5 text-[12px] leading-snug text-[#6e6e73]">
                This will be your Apple ID for signing in to the Store.
              </p>
            </div>

            <div>
              <label htmlFor="reg-password" className={labelCls}>
                Password
                <RequiredMark />
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                aria-required="true"
                aria-describedby="reg-password-hint"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
                placeholder="8+ chars, upper, lower, number"
                required
                minLength={8}
                disabled={loading}
              />
              <p id="reg-password-hint" className="mt-1.5 text-[12px] leading-snug text-[#6e6e73]">
                Use at least 8 characters with one uppercase letter, one lowercase letter, and one
                number.
              </p>
            </div>

            <div>
              <label htmlFor="reg-confirm" className={labelCls}>
                Confirm password
                <RequiredMark />
              </label>
              <input
                id="reg-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                aria-required="true"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value)
                  setMatchError(false)
                }}
                className={field}
                placeholder="Re-enter password"
                required
                minLength={8}
                aria-invalid={matchError}
                disabled={loading}
              />
            </div>
            {matchError ? (
              <p className="text-[13px] text-[#bf4800]" role="alert">
                Passwords do not match.
              </p>
            ) : null}

            <div className="space-y-3">
              <div className="rounded-xl border border-black/[0.08] bg-[#f5f5f7] px-4 py-3">
                <label className="flex cursor-pointer items-start gap-3 text-[14px] text-[#1d1d1f]">
                  <input
                    id="reg-privacy"
                    name="privacyAccepted"
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => {
                      setPrivacyAccepted(e.target.checked)
                      if (e.target.checked && error.includes('Privacy Policy')) setError('')
                    }}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-black/25 text-[#0071e3] focus:ring-[#0071e3]"
                    aria-required="true"
                    disabled={loading}
                  />
                  <span className="leading-snug">
                    I agree to the{' '}
                    <a
                      href="#/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#0066cc] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </a>
                    <RequiredMark />
                  </span>
                </label>
              </div>
              <div className="rounded-xl border border-black/[0.08] bg-[#f5f5f7] px-4 py-3">
                <label className="flex cursor-pointer items-start gap-3 text-[14px] text-[#1d1d1f]">
                  <input
                    id="reg-terms"
                    name="termsAccepted"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked)
                      if (e.target.checked && error.includes('Terms of Use')) setError('')
                    }}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-black/25 text-[#0071e3] focus:ring-[#0071e3]"
                    aria-required="true"
                    disabled={loading}
                  />
                  <span className="leading-snug">
                    I agree to the{' '}
                    <a
                      href="#/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#0066cc] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Use
                    </a>
                    <RequiredMark />
                  </span>
                </label>
              </div>
            </div>

            <p className="text-[12px] leading-relaxed text-[#6e6e73]">
              Accounts are stored in your MySQL database via the local API server.
              Administrator accounts cannot be created here.
            </p>

            <button
              type="submit"
              disabled={loading || !privacyAccepted || !termsAccepted}
              className="w-full rounded-full bg-[#0071e3] py-3.5 text-[17px] font-medium text-white transition-colors hover:bg-[#0077ed] active:bg-[#006edb] disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Continue'}
            </button>
          </form>

          <p className="mt-6 text-center text-[15px] text-[#6e6e73]">
            Already have an account?{' '}
            <a href="#/login" className="font-medium text-[#0066cc] hover:underline">
              Sign in
            </a>
          </p>
        </div>

        <p className="mt-8 text-center text-[12px]">
          <a href="#/" className="text-[#0066cc] hover:underline">
            ‹ Back to Store
          </a>
        </p>
      </div>
    </main>
  )
}
