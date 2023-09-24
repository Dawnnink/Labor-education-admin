import React from 'react';
import { showAct } from '../types';
import dayjs from 'dayjs'
export interface IIN {
    id: number,
    department: string,
    department_id: number,
    name: string,
    description: string,
    poster: string | null,
    icon: string | null,
    position: string,
    contact_person: string,
    contact_phone_number: string,
    need_audit: boolean,
    need_checkout: boolean,
    state: string,
    enroll_number: number,
    participate_number: number,
    quota: number,
    registration_start_time: string,
    registration_end_time: string,
    activity_start_time: string,
    activity_end_time: string,
    reason: string
}
const initialShowAct: showAct[][] = [[
    {
        id: 0,
        name: '',
        state: 0,
        mounts: 0,
        quota: 0,
        registerAt: {
            registration_start_time: '',
            registration_end_time: '',
        },
        ActAt: {
            activity_start_time: '',
            activity_end_time: '',
        },
        Move: {
            Exp: '',
            canup: true,
            cansee: true,
        }
    }
],]
export type IINList = IIN[]

export function compareDates(date1: Date, date2: Date): number {
    if (date1 < date2) {
        return -1; // date1 在 date2 之前
    } else if (date1 > date2) {
        return 1; // date1 在 date2 之后
    } else {
        return 0; // date1 和 date2 相等
    }
}
export const GetActivity = (props: IINList) => {
    const data: showAct[][] = [[]]
    React.useMemo(() => {
        data === undefined ? initialShowAct : (props.map((item) => {
            // console.log(item)
            let State, draftMove;//用来存储现在目前的状态码
            State = 2;
            draftMove = {
                Exp: "继续编辑",
                canup: false,
                cansee: false,
            }
            if (item.state == "已发布") {
                // console.log(props)
                if (
                    dayjs().isAfter(dayjs(item.activity_end_time))
                    //如果说现在的时间在结束时间之后
                ) {
                    //已结束
                    State = 4;
                    draftMove = {
                        Exp: "导出名单",
                        canup: false,
                        cansee: false,
                    }

                }
                else if (
                    dayjs().isAfter(dayjs(item.registration_start_time))
                    &&
                    dayjs().isBefore(dayjs(item.registration_end_time))
                    // 现在的时间在报名时间范围内
                ) {
                    //报名中
                    State = 1;
                    draftMove = {
                        Exp: "编辑活动",
                        canup: true,
                        cansee: true,
                    }

                } else if (
                    dayjs().isBefore(dayjs(item.registration_start_time))
                    //现在的时间在报名时间之前
                ) {
                    //待报名
                    State = 6;
                    draftMove = {
                        Exp: "编辑活动",
                        canup: false,
                        cansee: false,
                    }

                } else if (
                    dayjs().isBefore(dayjs(item.activity_start_time))
                    &&
                    dayjs().isAfter(dayjs(item.registration_end_time))
                    //现在时间在活动开始时间之前//报名结束时间之后
                ) {
                    //待开始
                    State = 7;
                    draftMove = {
                        Exp: "编辑活动",
                        canup: false,
                        cansee: true,
                    }
                } else if (
                    dayjs().isAfter(dayjs(item.activity_start_time))
                    &&
                    dayjs().isBefore(dayjs(item.activity_end_time))
                    //正在进行
                ) {
                    //进行中
                    State = 8;
                    draftMove = {
                        Exp: "编辑活动",
                        canup: false,
                        cansee: true,
                    }
                }
            } else if (item.state == '审核失败') {
                State = 3;
                draftMove = {
                    Exp: "重新编辑",
                    canup: false,
                    cansee: false,
                }
            } else if (item.state == '审核中') {
                State = 5;
                draftMove = {
                    Exp: "编辑活动",
                    canup: false,
                    cansee: false,
                }
            }
            return data.push(
                [{
                    id: item.id,
                    name: item.name,
                    state: State,
                    mounts: item.enroll_number,
                    quota: item.quota,
                    registerAt: {
                        registration_start_time: dayjs(item.registration_start_time).format('YYYY-MM-DD HH:mm'),
                        registration_end_time: dayjs(item.registration_end_time).format('YYYY-MM-DD HH:mm'),
                    },
                    ActAt: {
                        activity_start_time: dayjs(item.activity_start_time).format('YYYY-MM-DD HH:mm'),
                        activity_end_time: dayjs(item.activity_end_time).format('YYYY-MM-DD HH:mm'),
                    },
                    Move: draftMove
                }],
            )
        })) || [];
    }, [...props.map((item) => { return item.state }), data, props])

    return data;
}

