import React, { useMemo, FC, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Table, message } from 'antd'
import { columnsData } from './form'
import { network } from '~/utils/network'
import { ChangeForm } from '~/utils/hooks/changeForm'
import CheckChange from '~/utils/hooks/CheckChange'
import { IChange } from '~/utils/hooks/CheckChange'
import { useNavigate } from 'react-router-dom';
import { Tag } from '~/components/Small/Tag'
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

export interface ITableColumn {
    title: string
    dataIndex: string
    key: string
}
export const CheckTable: FC = () => {
    const Navigate = useNavigate();

    const { data } = network.admin.useActivities();
    let base: IChange[] = [];
    data === undefined ? null : base = CheckChange(data);
    console.log(base);
    const { columns, rows } = ChangeForm(columnsData, base);
    console.log('columns', columns);
    console.log('rows', rows);

    const columnsRender = useMemo(() => {
        if (base) {
            return columns.map((item: any, index: number) => {
                if (index == 0) {
                    return {
                        ...item,
                        render: (name: string, record: IChange) => {
                            return (
                                <p
                                    style={{
                                        color: "#1890FF",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        Navigate(`/exam/${record.id}`)
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
                        render: (activityAt: { activity_start_time: string, activity_end_time: string }) => {
                            return (
                                <div>
                                    <p>{activityAt.activity_start_time}</p>
                                    <p>{activityAt.activity_end_time}</p>
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
        <Box
            sx={{
                margin: '24px'
            }}
        >
            <Table columns={columnsRender} dataSource={rows} />
        </Box>
    )
}
