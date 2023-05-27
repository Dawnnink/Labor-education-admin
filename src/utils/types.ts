export interface Activity {
  id: number
  department: string
  department_id: number
  name: string
  description: string
  poster: string
  icon: string
  position: string
  contact_person: string
  contact_phone_number: string
  need_audit: boolean
  state: '审核中' | '审核失败' | '已发布'
  enroll_number: number
  quota: number

  // ISO 8601
  registration_start_time: string
  registration_end_time: string
  activity_start_time: string
  activity_end_time: string
}
