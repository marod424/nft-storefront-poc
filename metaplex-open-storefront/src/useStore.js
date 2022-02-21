import { useContext, createContext } from 'react'

export const StoreContext = createContext(null)

export const useStore = () => {
  return useContext(StoreContext)
}