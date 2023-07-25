import React from 'react'
import { Box } from '@mui/material'
import { Table } from 'antd'
import { network } from '~/utils/network'
export interface IAdActivity {
    id: number
    department: string
    department_id: number
    creator: string
    creator_id: string
    description: string
    poster: string
    icon: string
    position: string
    contact_people: string
    contact_phone_number: string
    need_audit: boolean
    state: string
    enroll_number: number
    quota: number
    registration_start_time: string
    registration_end_time: string
    activity_start_time: string
    activity_end_time: string
}
export default function CheckTable() {

    return (
        <div></div>
    )
}
