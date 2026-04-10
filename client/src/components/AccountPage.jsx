import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { apiUserProfile } from '../api/client.js'
import { useAuth } from '../hooks/useAuth.js'

const ease = [0.22, 1, 0.36, 1]

export default function AccountPage() {
  const { logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void apiUserProfile()
      .then(res => {
        if (res.ok && res.user) setProfile(res.user)
      })
      .catch(err => {
        setError(err.message || 'Could not load account details.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const initial = profile?.username ? profile.username.charAt(0).toUpperCase() : profile?.email?.charAt(0).toUpperCase() || ''

  return (
    <main className="mx-auto max-w-[980px] px-4 pb-24 pt-14 md:px-6 md:pt-16">
      <div className="text-center md:text-left border-b border-black/[0.08] pb-6 mb-8">
        <Motion.h1
          className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          Account
        </Motion.h1>
      </div>

      <div className="mx-auto max-w-2xl bg-white rounded-[24px] shadow-sm border border-black/[0.06] p-6 lg:p-10">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-[15px] text-[#6e6e73]">Loading your account…</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-[15px] text-[#bf4800]">{error}</p>
          </div>
        ) : profile ? (
          <Motion.div 
            className="flex flex-col md:flex-row gap-8 items-center md:items-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Avatar Section */}
            <div className="shrink-0 flex flex-col items-center gap-4">
              <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] flex items-center justify-center text-[40px] font-medium text-[#1d1d1f] shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-black/[0.04]">
                {initial}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 w-full space-y-6 text-center md:text-left">
              <div>
                <p className="text-[12px] uppercase tracking-wider font-semibold text-[#86868b] mb-1">Email</p>
                <p className="text-[17px] font-medium text-[#1d1d1f]">{profile.email}</p>
              </div>

              {profile.username && (
                <div className="border-t border-black/[0.04] pt-4">
                  <p className="text-[12px] uppercase tracking-wider font-semibold text-[#86868b] mb-1">Username</p>
                  <p className="text-[17px] font-medium text-[#1d1d1f]">{profile.username}</p>
                </div>
              )}

              <div className="border-t border-black/[0.04] pt-4">
                <p className="text-[12px] uppercase tracking-wider font-semibold text-[#86868b] mb-1">Member Since</p>
                <p className="text-[17px] font-medium text-[#1d1d1f]">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, {
                    month: 'long', day: 'numeric', year: 'numeric'
                  }) : 'Unknown'}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-black/[0.04] pt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                {profile.role !== 'super_admin' && (
                  <a
                    href="#/orders"
                    className="inline-flex items-center justify-center rounded-full bg-[#f5f5f7] px-6 py-2.5 text-[15px] font-medium text-[#1d1d1f] transition hover:bg-[#e8e8ed]"
                  >
                    View Orders
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => { void logout() }}
                  className="inline-flex items-center justify-center rounded-full border border-black/[0.12] bg-white px-6 py-2.5 text-[15px] font-medium text-red-600 transition hover:bg-red-50 hover:border-red-200"
                >
                  Log Out
                </button>
              </div>
            </div>
          </Motion.div>
        ) : null}
      </div>
    </main>
  )
}
