import React from 'react';
import { showAct } from '../types';
export interface IIN {
    id: number,
    department: string,
    department_id: number,
    name: string,
    description: string,
    poster: string,
    icon: string,
    position: string,
    contact_person: string,
    contact_phone_number: string,
    need_audit: boolean,
    state: string,
    enroll_number: number,
    participate_number: number,
    quota: number,
    registration_start_time: string,
    registration_end_time: string,
    activity_start_time: string,
    activity_end_time: string,
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
export const GetActivity = (props: IINList) => {
    function compareDates(date1: Date, date2: Date): number {
        if (date1 < date2) {
            return -1; // date1 在 date2 之前
        } else if (date1 > date2) {
            return 1; // date1 在 date2 之后
        } else {
            return 0; // date1 和 date2 相等
        }
    }

    // 使用示例
    function parseDateString(dateString: string): Date {
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    function formatTime(timeString: string): string {
        const inputDate = new Date(timeString);
        const year = inputDate.getUTCFullYear().toString().padStart(4, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const hours = inputDate.getUTCHours().toString().padStart(2, '0');
        const minutes = inputDate.getUTCMinutes().toString().padStart(2, '0');
        const seconds = inputDate.getUTCSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const currentDate = new Date();
    let data: showAct[][] = [[]]

    React.useMemo(() => {
        data === undefined ? data = initialShowAct : (props.map((item, value) => {
            // console.log(item)
            if (item.state == "已发布") {
                // console.log(props)
                if (
                    compareDates(currentDate, parseDateString(formatTime(item.activity_end_time))) > 0
                    //如果说现在的时间在结束时间之后
                ) {
                    console.log(parseDateString(formatTime(item.activity_end_time)))
                    //已结束
                    return data.push(
                        [{
                            id: item.id,
                            name: item.name,
                            state: 4,
                            mounts: item.enroll_number,
                            quota: item.quota,
                            registerAt: {
                                registration_start_time: formatTime(item.registration_start_time),
                                registration_end_time: formatTime(item.registration_end_time),
                            },
                            ActAt: {
                                activity_start_time: formatTime(item.activity_start_time),
                                activity_end_time: formatTime(item.activity_end_time),
                            },
                            Move: {
                                Exp: "导出名单",
                                canup: false,
                                cansee: false,
                            }
                        }],
                    )
                }
                else if (
                    compareDates(currentDate, parseDateString(formatTime(item.registration_start_time))) >= 0
                    &&
                    compareDates(currentDate, parseDateString(formatTime(item.registration_end_time))) < 0
                    // 现在的时间在报名时间范围内
                ) {
                    //报名中
                    return data.push(
                        [{
                            id: item.id,
                            name: item.name,
                            state: 1,
                            mounts: item.enroll_number,
                            quota: item.quota,
                            registerAt: {
                                registration_start_time: formatTime(item.registration_start_time),
                                registration_end_time: formatTime(item.registration_end_time),
                            },
                            ActAt: {
                                activity_start_time: formatTime(item.activity_start_time),
                                activity_end_time: formatTime(item.activity_end_time),
                            },
                            Move: {
                                Exp: "导出名单",
                                canup: true,
                                cansee: true,
                            }
                        }],
                    )
                } else if (
                    compareDates(currentDate, parseDateString(formatTime(item.registration_start_time))) < 0
                    //现在的时间在报名时间之前
                ) {
                    //待报名
                    return data.push(
                        [{
                            name: item.name,
                            state: 6,
                            mounts: item.enroll_number,
                            quota: item.quota,
                            registerAt: {
                                registration_start_time: formatTime(item.registration_start_time),
                                registration_end_time: formatTime(item.registration_end_time),
                            },
                            ActAt: {
                                activity_start_time: formatTime(item.activity_start_time),
                                activity_end_time: formatTime(item.activity_end_time),
                            },
                            Move: {
                                Exp: "编辑活动",
                                canup: false,
                                cansee: false,
                            },
                            id: item.id,

                        }],
                    )
                } else if (
                    compareDates(currentDate, parseDateString(formatTime(item.activity_start_time))) < 0
                    &&
                    compareDates(currentDate, parseDateString(formatTime(item.registration_end_time))) > 0
                    //现在时间在活动开始时间之前//报名结束时间之后
                ) {
                    //待开始
                    return data.push(
                        [{
                            id: item.id,
                            name: item.name,
                            state: 7,
                            mounts: item.enroll_number,
                            quota: item.quota,
                            registerAt: {
                                registration_start_time: formatTime(item.registration_start_time),
                                registration_end_time: formatTime(item.registration_end_time),
                            },
                            ActAt: {
                                activity_start_time: formatTime(item.activity_start_time),
                                activity_end_time: formatTime(item.activity_end_time),
                            },
                            Move: {
                                Exp: "导出名单",
                                canup: false,
                                cansee: true,
                            }
                        }],
                    )
                } else if (
                    compareDates(currentDate, parseDateString(formatTime(item.activity_start_time))) >= 0
                    &&
                    compareDates(currentDate, parseDateString(formatTime(item.activity_end_time))) < 0
                    //正在进行
                ) {
                    //进行中
                    return data.push(
                        [{
                            id: item.id,
                            name: item.name,
                            state: 8,
                            mounts: item.enroll_number,
                            quota: item.quota,
                            registerAt: {
                                registration_start_time: formatTime(item.registration_start_time),
                                registration_end_time: formatTime(item.registration_end_time),
                            },
                            ActAt: {
                                activity_start_time: formatTime(item.activity_start_time),
                                activity_end_time: formatTime(item.activity_end_time),
                            },
                            Move: {
                                Exp: "导出名单",
                                canup: false,
                                cansee: true,
                            }
                        }],
                    )
                }
            } else if (item.state == '审核失败') {
                return data.push(
                    [{
                        id: item.id,
                        name: item.name,
                        state: 3,
                        mounts: item.enroll_number,
                        quota: item.quota,
                        registerAt: {
                            registration_start_time: formatTime(item.registration_start_time),
                            registration_end_time: formatTime(item.registration_end_time),
                        },
                        ActAt: {
                            activity_start_time: formatTime(item.activity_start_time),
                            activity_end_time: formatTime(item.activity_end_time),
                        },
                        Move: {
                            Exp: "编辑活动",
                            canup: false,
                            cansee: false,
                        }
                    }],
                )
            } else if (item.state == '审核中') {
                return data.push(
                    [{
                        id: item.id,
                        name: item.name,
                        state: 5,
                        mounts: item.enroll_number,
                        quota: item.quota,
                        registerAt: {
                            registration_start_time: formatTime(item.registration_start_time),
                            registration_end_time: formatTime(item.registration_end_time),
                        },
                        ActAt: {
                            activity_start_time: formatTime(item.activity_start_time),
                            activity_end_time: formatTime(item.activity_end_time),
                        },
                        Move: {
                            Exp: "编辑活动",
                            canup: false,
                            cansee: false,
                        }
                    }],
                )
            }
            return data.push(
                [{
                    id: item.id,
                    name: item.name,
                    state: 2,
                    mounts: item.enroll_number,
                    quota: item.quota,
                    registerAt: {
                        registration_start_time: formatTime(item.registration_start_time),
                        registration_end_time: formatTime(item.registration_end_time),
                    },
                    ActAt: {
                        activity_start_time: formatTime(item.activity_start_time),
                        activity_end_time: formatTime(item.activity_end_time),
                    },
                    Move: {
                        Exp: "编辑活动",
                        canup: false,
                        cansee: false,
                    }
                }],
            )
        })) || [];
    }, [props])
    return data;
}

