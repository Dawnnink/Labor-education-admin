import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Store {
  token: string | null
  logout: () => void
  login: (token: string) => void
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
