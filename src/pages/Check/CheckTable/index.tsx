import React, { useMemo, FC, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Table, message } from 'antd'
import { columnsData } from './form'
import { network } from '~/utils/network'
import { ChangeForm } from '~/utils/hooks/changeForm'
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
    name: string
}
export interface IChange {
    id: number
    name: string
    state: string
    quota: number
    enroll_number: number
    registerAt: {
        registration_start_time: string
        registration_end_time: string
    }
    activityAt: {
        activity_start_time: string
        activity_end_time: string
    }
}
export interface ITableColumn {
    title: string
    dataIndex: string
    key: string
}
export const CheckTable: FC = () => {


    const { data } = network.admin.useActivities();
    console.log(data);


    return (
        <Box>
            {/* <Table columns={columns} dataSource={rows} /> */}
        </Box>
    )
}
