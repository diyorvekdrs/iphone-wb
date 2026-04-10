import { useEffect, useMemo, useState } from 'react'
import { apiIphoneSpecs } from '../api/client.js'
import { IphoneSpecsContext } from './iphone-specs-context.js'

export function IphoneSpecsProvider({ children }) {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiIphoneSpecs()
        if (!cancelled) {
          setModels(Array.isArray(data.models) ? data.models : [])
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load iPhone specs.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const bySlug = useMemo(() => {
    const m = {}
    for (const row of models) {
      if (row?.slug) m[row.slug] = row
    }
    return m
  }, [models])

  const value = useMemo(
    () => ({ bySlug, models, loading, error }),
    [bySlug, models, loading, error],
  )

  return (
    <IphoneSpecsContext.Provider value={value}>{children}</IphoneSpecsContext.Provider>
  )
}
