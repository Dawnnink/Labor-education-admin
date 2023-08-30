import { ActivityReEdit } from '~/components/ActivityReEdit'
import { network } from '~/utils/network'
import onOrigin from '~/utils/FormOrigin'
import { Department } from '~/utils/types';
import dayjs from 'dayjs';
import { Backdrop, CircularProgress } from '@mui/material'

const Reset = () => {
    const params: string = window.location.pathname;
    //使用正则表达式获取路径参数
    const regex = /\/(\d+)$/;
    const match = params.match(regex);

    const Id = match ? match[1] : null;
    const { data: department } = network.teacher.useDepartment();
    const { data: activities } = network.teacher.useActivity(parseInt(Id as string));
    const newActivity = onOrigin(activities, department as Department[]);

    //加载中
    if (newActivity && activities) {
        delete newActivity.registerAt;
        delete newActivity.joinAt;
        newActivity.registerAt = []
        newActivity.registerAt.push(dayjs(activities.registration_start_time))
        newActivity.registerAt.push(dayjs(activities.registration_end_time))
        newActivity.joinAt = []
        newActivity.joinAt.push(dayjs(activities.activity_start_time))
        newActivity.joinAt.push(dayjs(activities.activity_end_time))
    }
    if (!activities) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        ) // 或者显示其他加载中的内容
    }
    return <ActivityReEdit initialActivity={newActivity} isShow={true} id={parseInt(Id as string)} />
}

export default Reset
