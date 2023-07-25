export interface IChange {
    id: number
    name: string
    state: number
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
import { IAdActivity } from "~/pages/Check/CheckTable"
export default function CheckChange(rows: IAdActivity[]) {
    const newRows: Array<IChange> = [];
    newRows.push(
        ...rows.map((items: IAdActivity, index: number) => {
            let status = 0;
            switch (items.state) {
                case "审核中":
                    status = 9
                    break;
                case "审核失败":
                    status = 3
                    break;
                case "已发布":
                    status = 10
                    break;
            }
            return {
                id: items.id,
                name: items.name,
                state: status,
                quota: items.quota,
                enroll_number: items.enroll_number,
                registerAt: {
                    registration_start_time: items.registration_start_time,
                    registration_end_time: items.registration_end_time,
                },
                activityAt: {
                    activity_start_time: items.activity_start_time,
                    activity_end_time: items.activity_end_time,
                },
            }
        }))
    return newRows;
}
