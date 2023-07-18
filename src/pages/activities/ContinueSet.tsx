import { ActivityEditor } from '~/components/ActivityEditor'
import { useNavigate } from 'react-router-dom'
import { Activity } from '~/utils/types';
import { Button, message } from 'antd'
import { network } from '~/utils/network'

const Continue = () => {
    const Navigate = useNavigate();
    const { data: departments } = network.teacher.useDepartment()
    const activity = JSON.parse(localStorage.getItem('activity') as string) as Activity;
    const newValues = { ...activity }
    let len = 0
    departments === undefined ? len = 0 : len = departments.length
    let str = " "
    let index = 0;
    if (departments === undefined) {
        str = "无"
    } else {
        for (let i = 0; i < len; i++) {
            if (departments[i].name == activity?.department_id as unknown as string) {
                str = departments[i].name
                index = departments[i].id
            }
        }
    }
    newValues.department = newValues.department || str;
    newValues.department_id = index;

    return (
        <div>
            <ActivityEditor initialActivity={activity as Activity} isShow={true} isDel={true} />
        </div>

    )



}

export default Continue
