import { Department } from './types';
import dayjs from 'dayjs'

const onOrigin = (values: any, departments: Department[]) => {
    const newValues = {
        ...values,
    }
    if (values != null) {
        newValues.registerAt = [];
        newValues.registerAt.push(dayjs(values?.registration_start_time))
        newValues.registerAt.push(dayjs(values?.registration_end_time))
        newValues.joinAt = []
        newValues.joinAt.push(dayjs(values?.activity_start_time))
        newValues.joinAt.push(dayjs(values?.activity_end_time))
        delete newValues.activity_start_time
        delete newValues.activity_end_time
        delete newValues.registration_end_time
        delete newValues.registration_start_time
    }

    let len = 0
    departments === undefined ? len = 0 : len = departments.length
    let str = " "
    if (departments === undefined) {
        str = "无"
    } else {
        for (let i = 0; i < len; i++) {
            if (departments[i].id == values?.department_id) {
                str = departments[i].name
            }
        }
    }
    newValues.department_id = newValues.department || str;

    return newValues;
}

export default onOrigin;