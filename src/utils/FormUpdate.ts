import { message, Modal } from 'antd';
import { network } from '~/utils/network'
import { Department } from '~/utils/types'
import dayjs, { Dayjs } from 'dayjs'
//这边可能有个bug，就是departmentid，虽然上传的时候一定会有有个department，但是如果这个地方收到的数据department是空的的话那么就无法正常更新活动
export function compare(reTime: Dayjs[], joTime: Dayjs[], isChange: number): boolean {
    if (dayjs().isAfter(reTime[0]) && isChange === 1) {
        message.warning("报名开始时间过晚")
        return false;
    } else if (dayjs().isAfter(joTime[0])) {
        message.warning("活动开始时间过晚")
        return false;
    } else if (reTime[1].isAfter(joTime[0])) {
        message.warning("活动开始时间过晚")
        return false;
    }
    return true;
}

const OnUpdate = (fieldsValue: any, departments: Department[] | undefined, imageUrl: string | undefined, iconUrl: string | undefined, id: number, isChange: number) => {
    const registerValue = fieldsValue['registerAt'];
    const joinValue = fieldsValue['joinAt'];
    if (!compare(registerValue, joinValue, isChange)) {
        return;
    }
    if (fieldsValue['poster'] === undefined) {
        message.warning("请上传活动海报");
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
    departments?.map((item) => {
        if (item.name === college) {
            values.department_id = item.id;
        }
    })
    imageUrl === undefined ? values.poster = null : values.poster = imageUrl;
    iconUrl === undefined ? values.icon = null : values.icon = iconUrl;
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