import axios, { AxiosError, AxiosInstance } from 'axios'
import useSWR from 'swr'
import { useStore } from './store'
import { User } from './types'

export type ApiError = AxiosError<{
  code: number
  message: string
}>

export class BaseService {
  protected axios: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axios = axios
  }

  private fetcher = async <T>(url: string) => {
    const { data } = await this.axios.get<T>(url)
    return data
  }

  protected useGet = <T>(
    url: string | null,
    query?: Record<string, string | number | undefined>
  ) => {
    if (url === null) {
      return useSWR<T, ApiError>(null, this.fetcher)
    }
    const filteredQuery =
      query &&
      (Object.fromEntries(
        Object.entries(query)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ) as Record<string, string>)

    return useSWR<T, ApiError>(
      url +
        (filteredQuery ? `?${String(new URLSearchParams(filteredQuery))}` : ''),
      this.fetcher
    )
  }
}

export interface AuthRequest {
  account: string
  password: string
}
export interface AuthResponse {
  token: string
}

export interface UpdatePasswordRequest {
  old_password: string
  new_password: string
}

export class Service extends BaseService {
  constructor(axios: AxiosInstance) {
    super(axios)
    this.useAxiosInterceptor()
  }

  private useAxiosInterceptor = () => {
    this.axios.interceptors.request.use((config) => {
      if (config.url?.endsWith('/login')) {
        return config
      }

      const token = useStore.getState().token
      if (token) {
        config.headers.Authorization = `passport ${token}`
      }
      return config
    })
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
        }
        return Promise.reject(error)
      }
    )
  }

  login = async (request: AuthRequest) => {
    const {
      data: { token },
    } = await this.axios.post<AuthResponse>(`/user/token`, request)
    useStore.getState().login(token)
  }

  logout = () => {
    useStore.getState().logout()
    location.replace('/')
  }

  useUser = () => {
    return this.useGet<User>(`/user/info`)
  }
}

const baseUrl = 'https://labor-be.ncuos.com/api/v1'

const axiosInstance = axios.create({
  baseURL: baseUrl,
})

export const network = new Service(axiosInstance)
