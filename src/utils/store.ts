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
import { AuthRequest } from './network'
export interface ICrenditial {
  crenditial: AuthRequest
  setCrenditial: (crenditial: AuthRequest) => void
  removeCrenditial: () => void
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
//登陆后将自己的账号密码本地存储之后然后每隔一分钟就重新获取token并将新token覆盖旧token
export const useCrenditial = create<ICrenditial>()(
  persist(
    (set) => ({
      crenditial: {
        username: '',
        password: '',
      },
      setCrenditial: (crenditial) => set({ crenditial }),
      removeCrenditial: () => {
        set({ crenditial: { username: '', password: '', } })
      }
    }),
    {
      name: "labor-crenditial",
      version: 1,
    }
  )
)