import axios, { AxiosError, AxiosInstance } from 'axios'
import useSWR from 'swr'
import { useStore, useRoot } from './store'
import { Activity, Department, User } from './types'
import { ActivityStudentsProps } from '~/components/ActivityStudents'
import fileDownload from 'js-file-download'
import imageCompression from 'browser-image-compression'
import { IIN } from '~/utils/hooks/getActivity'
import { message } from 'antd'
import { IAdActivity } from '~/pages/Check/CheckTable'

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
  | 'reason'
>

export interface SignOssRequest {
  filename: string
}
export interface SignOssResponse {
  upload_url: string
  download_url: string
  expire_seconds: number
}

export interface IUser {
  id: number
  name: string
  uid: string
  avatar: string
  sex: string
  college: string
  phone_number: string
  role_ids: number[]
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

  private signFileUploadUrl = async (
    filename: string
  ): Promise<SignOssResponse> => {
    const { data } = await this.axios.post<SignOssResponse>(
      '/teacher/activity/file',
      {
        filename,
      }
    )
    return data
  }

  uploadImage = async (file: File): Promise<string> => {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    })
    const { upload_url, download_url } = await this.signFileUploadUrl(file.name)
    // Global axios instance is used here.
    await axios.put(upload_url, compressedFile, {
      headers: {
        'Content-Type': '', // Empty string to remove default header to satisfy OSS
      },
    })
    return download_url
  }
  getRoot = async (): Promise<IUser | boolean> => {
    const data = await this.axios.get<IUser>('user/info')
      .then((res) => {
        return res.data
      })
      .catch(() => {
        message.error("当前权限不明确");
        return false;
      })
    return data;
    // useRoot.getState().setRoot(Math.max(...data.role_ids))

    //拿到权限的数据，然后返回
  }
  delRoot = () => {
    useRoot.getState().removeRoot();
    location.replace('/')
  }
  teacher = {
    useCode: (id: number) => {
      return this.useGet<Code>(`/teacher/activity/code?id=${id}`)
    },
    useDepartment: () => {
      return this.useGet<Department[]>('/teacher/department/list')
    },
    delActivities: async (params: number) => {
      const res = await this.axios.delete(`/teacher/activity?id=${params}`);
      return res
    },
    useActivities: () => {
      return this.useGet<IIN[]>(`/teacher/activity/list`)
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
      return await this.axios.post('/teacher/activity', activity)
    },

    updateActivity: async (activity: Activity) => {
      return await this.axios.put('/teacher/activity', activity)
    },

    usePass: async (id: number, user: number[]) => {
      await this.axios.post(`/teacher/activity/participate/pass?id=${id}`, user)
    },
    useReject: async (id: number, user: number[]) => {
      await this.axios.post(`/teacher/activity/participate/reject?id=${id}`, user)
    },
    downloadActivityStudentsExcel: async (activityId: number) => {
      const data = await this.axios.get(
        `/teacher/activity/participate/excel?id=${activityId}`,
        {
          responseType: 'blob',
        }
      ).then((res) => {
        return res.data;
      }).catch(() => {
        message.error("报名成功人数为零")
        return false;
      })
      if (data) {
        fileDownload(
          data,
          `活动学生列表-${activityId}-${new Date().toLocaleDateString()}.xls`
        )
        message.success("已成功导出")

      }

    },
  }
  admin = {
    useActivities: () => {
      return this.useGet<Array<IAdActivity>>('/admin/activity/list')
    },
    useActivity: (id: number) => {
      return this.useGet<IAdActivity>('/admin/activity/detail', { id })
    },
    usePass: async (id: number[]) => {
      return await this.axios.post('/admin/activity/pass', id)
    },
    useReject: async (id: number, reason: string) => {
      return await this.axios.post('/admin/activity/reject', { id, reason })
    }
  }
}

export const baseUrl = 'https://labor-be.ncuos.com/api/v1'

const axiosInstance = axios.create({
  baseURL: baseUrl,
})

export const network = new Service(axiosInstance)
interface Code {
  code: string;
}