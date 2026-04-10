import { createContext } from 'react'

export const IphoneSpecsContext = createContext({
  bySlug: /** @type {Record<string, object>} */ ({}),
  models: [],
  loading: true,
  error: null,
})
