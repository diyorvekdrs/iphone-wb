import { useState } from 'react'
import { apiLogin } from '../../api/client.js'
import { useAuth } from '../../hooks/useAuth.js'

const field =
  'mt-1.5 w-full rounded-xl border border-black/[0.12] bg-white px-4 py-3 text-[17px] text-[#1d1d1f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/25'

const labelCls = 'text-[13px] font-medium text-[#1d1d1f]'

export default function LoginPage() {
  const { refresh } = useAuth()
  const [asAdmin, setAsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [adminUser, setAdminUser] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiLogin({ email, password })
      await refresh()
      window.location.hash = '#/'
    } catch (err) {
      setError(err.message || 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-11 text-[#1d1d1f]">
      <div className="mx-auto flex min-h-[calc(100vh-2.75rem)] max-w-[420px] flex-col justify-center px-5 pb-16 pt-10 md:px-6">
        <div className="rounded-[20px] border border-black/[0.06] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-10">
          <p className="text-center text-[13px] font-medium text-[#6e6e73]">
             Store
          </p>
          <h1 className="mt-2 text-center text-[28px] font-semibold leading-tight tracking-[-0.02em] md:text-[32px]">
            Sign in
          </h1>
          <p className="mt-2 text-center text-[15px] leading-snug text-[#6e6e73]">
            Use your Apple ID to continue.
          </p>

          <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
            {error ? (
              <p className="rounded-lg bg-[#fff3f0] px-3 py-2 text-[13px] text-[#bf4800]" role="alert">
                {error}
              </p>
            ) : null}

            <div>
              <label htmlFor="login-email" className={labelCls}>
                Apple ID, email, or username
              </label>
              <input
                id="login-email"
                name="email"
                type="text"
                autoComplete="username"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="login-password" className={labelCls}>
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
                placeholder="••••••••"
                required
                minLength={1}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#0071e3] py-3.5 text-[17px] font-medium text-white transition-colors hover:bg-[#0077ed] active:bg-[#006edb] disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-center text-[14px]">
            <a
              href="#"
              className="text-[#0066cc] hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
            <p className="text-[#6e6e73]">
              Don’t have an account?{' '}
              <a href="#/register" className="font-medium text-[#0066cc] hover:underline">
                Create yours
              </a>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[12px] leading-relaxed text-[#6e6e73]">
          <a href="#/" className="text-[#0066cc] hover:underline">
            ‹ Back to Store
          </a>
        </p>
      </div>
    </main>
  )
}
