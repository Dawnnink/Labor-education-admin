import { message, Modal } from 'antd';
import { network } from '~/utils/network'
import { Department } from '~/utils/types'
import dayjs, { Dayjs } from 'dayjs'

export function compare(reTime: Dayjs[], joTime: Dayjs[]): boolean {
    if (dayjs().isAfter(reTime[0])) {
        message.warning("请检查时间格式")
        return false;
    } else if (dayjs().isAfter(joTime[0])) {
        message.warning("请检查时间格式")
        return false;
    } else if (reTime[1].isAfter(joTime[0])) {
        message.warning("请检查时间格式")
        return false;
    }
    return true;
}

const OnUpdate = (fieldsValue: any, departments: Department[] | undefined, imageUrl: string | undefined, iconUrl: string | undefined, id: number) => {
    const registerValue = fieldsValue['registerAt'];
    const joinValue = fieldsValue['joinAt'];
    if (!compare(registerValue, joinValue)) {
        return;
    }
    const values = {
        ...fieldsValue,
        "registration_start_time":
            registerValue[0].format('YYYY-MM-DDTHH:mm:ss[Z]'),
        'registration_end_time':
            registerValue[1].format('YYYY-MM-DDTHH:mm:ss[Z]'),

        'activity_start_time':
            joinValue[0].format('YYYY-MM-DDTHH:mm:ss[Z]'),
        'activity_end_time':
            joinValue[1].format('YYYY-MM-DDTHH:mm:ss[Z]'),
    }
    delete values.registerAt;
    delete values.joinAt;
    // const calue
    const college = values.department_id;
    console.log(college)
    let index = 0;
    let len = 0;
    departments === undefined ? len = 0 : len = departments.length;
    if (departments === undefined) {
        index = 0;
    } else {
        for (let i = 0; i < len; i++) {
            if (departments[i].name == college) {
                index = departments[i].id;
            }
        }
    }
    values.icon = ' ';
    values.department_id = index;
    imageUrl === undefined ? values.poster = ' ' : values.poster = imageUrl;
    iconUrl === undefined ? values.icon = ' ' : values.icon = iconUrl;
    // console.log(values)
    values.id = id;

    const flag = network.teacher.updateActivity(values)
        .then((res) => {
            if (res.status === 200) {
                (Modal.warning({
                    title: '已提交成功',
                    okText: '确定',
                    onOk: () => {
                        location.reload();
                    },
                    style: { top: "calc(50% - 58px)" }
                }))
                return true;
            }
        }).catch(() => {
            message.error("请稍后再试")
            return false;
        })
    return flag;
}
export default OnUpdate;