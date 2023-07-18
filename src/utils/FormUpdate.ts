import { network } from '~/utils/network'
import { Department } from '~/utils/types'
import { useNavigate } from 'react-router-dom'
const OnUpdate = (fieldsValue: any, departments: Department[] | undefined, imageUrl: string | undefined, iconUrl: string | undefined, id: number) => {
    const Navigate = useNavigate()
    const registerValue = fieldsValue['registerAt'];
    const joinValue = fieldsValue['joinAt'];
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
    console.log(JSON.stringify(values))
    network.teacher.updateActivity(values)

    Navigate('/activities')
}

export default OnUpdate;