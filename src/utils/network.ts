import axios, { AxiosError, AxiosInstance } from 'axios'
import useSWR from 'swr'
import { useStore } from './store'
import { Activity, Department, User } from './types'
import { ActivityStudentsProps } from '~/components/ActivityStudents'
import fileDownload from 'js-file-download'

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
  username: string
  password: string
}
export interface AuthResponse {
  token: string
  message: string
  status: number
}

export interface UpdatePasswordRequest {
  old_password: string
  new_password: string
}

export type NewActivity = Pick<
  Activity,
  | 'department_id'
  | 'name'
  | 'description'
  | 'poster'
  | 'icon'
  | 'position'
  | 'contact_person'
  | 'contact_phone_number'
  | 'need_audit'
  | 'quota'
  | 'registration_start_time'
  | 'registration_end_time'
  | 'activity_start_time'
  | 'activity_end_time'
>
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
      data: { token, message, status },
    } = await this.axios.post<AuthResponse>(
      `https://os.ncuos.com/api/user/token`,
      request
    )
    if (status !== 1) {
      throw new Error(message)
    }
    useStore.getState().login(token)
  }

  logout = () => {
    useStore.getState().logout()
    location.replace('/')
  }

  useUser = () => {
    return this.useGet<User>(`/user/info`)
  }

  teacher = {
    useDepartment: () => {
      return this.useGet<Department[]>('/teacher/department/list')
    },

    useActivities: () => {
      return this.useGet<Activity[]>(`/teacher/activity/list`)
    },

    useActivity: (id: number) => {
      return this.useGet<Activity>(`/teacher/activity/detail`, { id })
    },

    useActivityStudents: (id: number) => {
      return this.useGet<ActivityStudentsProps['students']>(
        `/teacher/activity/participate`,
        { id }
      )
    },

    createActivity: async (activity: NewActivity) => {
      await this.axios.post('/teacher/activity', activity)
    },

    updateActivity: async (activity: Activity) => {
      await this.axios.put('/teacher/activity', activity)
    },

    downloadActivityStudentsExcel: async (activityId: number) => {
      const { data } = await this.axios.get(
        `/teacher/activity/participate/excel?id=${activityId}`,
        {
          responseType: 'blob',
        }
      )
      fileDownload(
        data,
        `活动学生列表-${activityId}-${new Date().toLocaleDateString()}`
      )
    },
  }
}

const baseUrl = 'https://labor-be.ncuos.com/api/v1'

const axiosInstance = axios.create({
  baseURL: baseUrl,
})

export const network = new Service(axiosInstance)
