import { Box } from '@mui/material'
import { columnsData } from './form'
import { ChangeForm } from '~/utils/hooks/changeForm'

import React, { FC, useMemo } from 'react';
import { Table, Button, message, Input, Modal } from 'antd';
import { ChangeData } from '~/utils/hooks/change';
import { Tag } from '~/components/Small/Tag';
import { network } from '~/utils/network';
// import { data as acc } from './origin'
import { GetActivity } from '~/utils/hooks/getActivity'
import { showAct } from '~/utils/types'
import { useNavigate } from 'react-router-dom'
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
    const Navigate = useNavigate();
    const { data } = network.admin.useActivities();
    console.log("data", data)

    let base: showAct[][] | undefined = undefined;
    data === undefined ? null : base = GetActivity(data);
    console.log("changeddata", base)

    const { columns, rows } = ChangeData(columnsData, base as showAct[][]);

    const columnsRender = useMemo(() => {
        if (base) {
            return columns.map((item: any, index: number) => {
                if (index == 0) {
                    return {
                        ...item,
                        render: (name: string, record: showAct) => {
                            return (
                                <p
                                    style={{
                                        color: "#1890FF",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        if (record.id != -1) {
                                            Navigate(`${record?.id}`)
                                        } else {
                                            Navigate('/continue/-1')
                                        }
                                    }}
                                >{name}</p>
                            )
                        }
                    }
                }
                if (index == 4) {
                    return {
                        ...item,
                        render: (registerAt: { registration_start_time: string, registration_end_time: string }) => {
                            return (
                                <div>
                                    <p>{registerAt.registration_start_time}</p>
                                    <p>{registerAt.registration_end_time}</p>
                                </div>
                            )
                        }
                    }
                } if (index == 5) {
                    return {
                        ...item,
                        render: (ActAt: { activity_start_time: string, activity_end_time: string }) => {
                            return (
                                <div>
                                    <p>{ActAt.activity_start_time}</p>
                                    <p>{ActAt.activity_end_time}</p>
                                </div>
                            )
                        }
                    }


                }
                if (index == 1) {
                    return {
                        ...item,
                        render: (state: number) => (
                            <div >
                                <Tag num={state} />
                            </div>
                        ),
                    }
                } else {
                    return item;
                }
            })
        } else {
            return []
        }

    }, [columns])
    return (
        <div>
            <Table columns={columnsRender} dataSource={rows} />
        </div>
    )
}
