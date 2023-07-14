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
        return new Date(dateString);
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

    // 使用示例
    const inputTime = "0001-01-01T00:00:00Z";
    const formattedTime = formatTime(inputTime);
    console.log(formattedTime);

    let data: showAct[][] = [[]];
    data = React.useMemo(() => {
        return props.map((item, value) => {
            if (compareDates(new Date(), new Date(item.activity_end_time)) > 0) {
                return [
                    {
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
                            isExport: 3,
                            isChecking: 2,
                            isDelete: 1,
                        }
                    },
                ]
            }
            if (item.state == '审核中') {
                return [{
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
                        isExport: 3,
                        isChecking: 2,
                        isDelete: 1,
                    }
                },]
            } else if (item.state == '审核失败') {
                return [{
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
                        isExport: 4,
                        isChecking: 2,
                        isDelete: 1,
                    }
                },]
            } else if (item.state == '已发布') {
                return [{
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
                        isExport: 1,
                        isChecking: 2,
                        isDelete: 1,
                    }
                },]
            }
            //全部都不符合，就是未发布
            return [{
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
                    isExport: 2,
                    isChecking: 1,
                    isDelete: 1,
                }
            }]

        })
    }, [props])
    return data;
}