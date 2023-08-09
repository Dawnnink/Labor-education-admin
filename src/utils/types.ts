
export interface Activity {
  id: number
  department: string
  department_id: number | string
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
  reason: string
}

export interface User {
  id: number
  name: string
  uid: string
  avatar: string
  college: string
  sex: '男' | '女'
  classname: string
  phone_number: string
}

export interface Department {
  id: number
  name: string
}


export interface showAct {
  id: number;
  name: string;
  state: number;
  mounts: number;
  quota: number;
  registerAt: {
    registration_start_time: string;
    registration_end_time: string;
  }
  ActAt: {
    activity_start_time: string;
    activity_end_time: string;
  }
  Move: {
    Exp: string;
    canup: boolean;
    cansee: boolean;
  }
}

export interface IParticipater {
  // activity: Activity;
  check_in: null | string;
  // participate_person: string;
  participate_time: string;
  state: string;
  user: User
}