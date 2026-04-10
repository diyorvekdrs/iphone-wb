import { useContext } from 'react'
import { IphoneSpecsContext } from '../context/iphone-specs-context.js'

export function useIphoneSpecs() {
  return useContext(IphoneSpecsContext)
}
