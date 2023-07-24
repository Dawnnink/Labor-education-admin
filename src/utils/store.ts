import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Store {
  token: string | null
  logout: () => void
  login: (token: string) => void
}
export interface IRoot {
  root: number | null
  setRoot: (root: number) => void
  removeRoot: () => void
}
export const useStore = create<Store>()(
  persist(
    (set) => ({
      token: null,
      logout: () => {
        set({ token: null })
        location.replace('/')
      },
      login: (token) => set({ token }),
    }),
    {
      name: 'labor-store',
      version: 1,
    }
  )
)

export const useRoot = create<IRoot>()(
  persist(
    (set) => ({
      root: null,
      setRoot: (root) => set({ root }),
      removeRoot: () => {
        set({ root: null })
        location.replace('/')
      }
    }),
    {
      name: 'labor-root',
      version: 1,
    }
  )
)