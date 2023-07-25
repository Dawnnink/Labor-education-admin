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
import { IAdActivity } from "~/pages/Check/CheckTable"
export default function CheckChange(rows: IAdActivity[]) {
    const newRows: Array<IChange> = [];
    newRows.push(
        ...rows.map((items: IAdActivity, index: number) => {
            return {
                id: items.id,
                name: items.name,
                state: items.state,
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
