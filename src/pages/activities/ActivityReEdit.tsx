import { ActivityReEdit } from '~/components/ActivityReEdit'
import { network } from '~/utils/network'
import onOrigin from '~/utils/FormOrigin'
import { Department } from '~/utils/types';
import style from './index.module.css';
import dayjs from 'dayjs';
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

const Reset = () => {
    const params: string = window.location.pathname;
    //使用正则表达式获取路径参数
    const regex = /\/(\d+)$/;
    const match = params.match(regex);

    const Id = match ? match[1] : null;
    const { data: department } = network.teacher.useDepartment();
    const { data: activities } = network.teacher.useActivity(parseInt(Id as string));
    console.log(activities)
    const newActivity = onOrigin(activities, department as Department[]);
    console.log(newActivity)

    //加载中
    if (newActivity && activities) {
        delete newActivity.registerAt;
        delete newActivity.joinAt;
        newActivity.registerAt = []
        newActivity.registerAt.push(dayjs(formatTime(activities.registration_start_time)))
        newActivity.registerAt.push(dayjs(formatTime(activities?.registration_end_time)))
        newActivity.joinAt = []
        newActivity.joinAt.push(dayjs(formatTime(activities?.activity_start_time)))
        newActivity.joinAt.push(dayjs(formatTime(activities?.activity_end_time)))
    }
    if (!activities) {
        return (
            <div className={style.box}>
                <div className={style.father}>

                </div>
                <div className={style.father}>

                </div>
                <div className={style.father}>

                </div>
            </div >
        ) // 或者显示其他加载中的内容
    }
    return <ActivityReEdit initialActivity={newActivity} isShow={true} id={parseInt(Id as string)} />
}

export default Reset
