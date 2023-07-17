import { ActivityReEdit } from '~/components/ActivityReEdit'
import { network } from '~/utils/network'
import { Activity } from '~/utils/types';
const Reset = () => {
    const params: string = window.location.pathname;
    //使用正则表达式获取路径参数
    const regex = /\/(\d+)$/;
    const match = params.match(regex);
    const Id = match ? match[1] : null;

    const { data: activities } = network.teacher.useActivity(parseInt(Id as string));
    return <ActivityReEdit initialActivity={activities as Activity} isShow={true} id={parseInt(Id as string)} />
}

export default Reset
