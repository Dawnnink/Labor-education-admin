import { ActivityReEdit } from '~/components/ActivityReEdit'
import { network } from '~/utils/network'
import onOrigin from '~/utils/FormOrigin'
import { Department } from '~/utils/types';
import style from './index.module.css'
const Reset = () => {
    const params: string = window.location.pathname;
    //使用正则表达式获取路径参数
    const regex = /\/(\d+)$/;
    const match = params.match(regex);
    console.log(match)

    const Id = match ? match[1] : null;
    const { data: department } = network.teacher.useDepartment();
    console.log("此时的ID", Id)
    console.log("此时的department", department)
    const { data: activities } = network.teacher.useActivity(parseInt(Id as string));
    console.log("此时的activity", activities)
    const newActivity = onOrigin(activities, department as Department[]);
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
