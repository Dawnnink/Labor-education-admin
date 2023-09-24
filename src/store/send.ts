import { create } from 'zustand';
import { produce } from 'immer'
import { Modal, message } from 'antd'
import { User } from '~/utils/types';
import { network } from '../utils/network'

interface SendState {
    students: {
        participate_time: string; // ISO 8601
        participate_reason: string;
        comment: string;
        state: '报名成功' | '报名失败' | '报名审核中';
        check_in: string; // ISO 8601
        check_out: string; //签退
        notified: boolean | null; //null不用通知，true已确认通知 false未确认通知
        user: User;
        reject_reason: string; //打回原因
    }[];
    reason: string//存放错误的原因
    activity_id: number;//活动的id
    user_id: number;//有些时候会单独打回或者通过
    sendPass: () => void;
    sendReject: () => void;
    sendBack: () => void; //签退
    getExcel: () => void;//导表
    setState: <T extends keyof SendState>(
        key: T
    ) => (value: SendState[T]) => void;
}
interface RejectUsers {
    reason: string;
    user_id: number;
}
export const useSendState = create<SendState>((set, get) => ({
    students: [],
    reason: '暂无原因',
    activity_id: 0,
    user_id: 0,
    sendPass: () => {
        const { students, activity_id, user_id } = get();//获取当前的选中学生数据
        let ids: number[] = []
        if (user_id !== 0) {
            ids = [user_id]
        } else {
            ids = students.map(it => it.user.id);
        }
        Modal.confirm({
            title: '确认通过审核？',
            onOk: async () => {
                network.teacher.usePass(activity_id, ids)
            },
            onCancel: () => {
                console.log('cancel');
            },
        })
    },
    sendReject: () => {
        const { students, reason, activity_id, user_id } = get();//获取当前的选中学生数据
        const ids = students.map(it => it.user.id);
        const whoWrong: { name: string }[] = [];//如果有错误的，用于存放错误的人的姓名{name:string}
        const users: Array<RejectUsers> = [];
        if (user_id !== 0) {
            users.push({
                reason: reason,
                user_id: user_id,
            })
        } else {
            ids.map((item) => {
                users.push({
                    reason: reason,
                    user_id: item,
                })
            })
        }
        Modal.confirm({
            title: '确认打回审核',
            onOk: async () => {
                const res = await network.teacher.useReject(activity_id, users)//2个参数，users是个数组
                if (res.length > 0) {
                    students.map(item => {
                        if (res.includes(item.user.id)) {
                            whoWrong.push({
                                name: item.user.name
                            })
                        }
                    })
                    message.error(`${whoWrong.map(item => item.name)}不符合打回条件，请确认`)
                }
            },
            onCancel: () => {
                console.log('nocancel');

            }
        })
    },
    sendBack: () => {
        const { students, activity_id, user_id } = get();//获取当前的选中学生数据
        students.map(item => {
            if (item.state !== '报名成功' && !item.check_in) {
                //如果状态不是已签到
                message.warning('所选人之中有人未签到')
                return;
            }
        })
        let user_ids: number[] = [];
        if (user_id !== 0) {
            user_ids.push(user_id)
        } else {
            user_ids = students.map((item) => {
                return item.user.id;
            })
        }
        const whoWrong: { name: string }[] = [];//如果有错误的，用于存放错误的人的姓名{name:string}
        Modal.confirm({
            title: '确认签退',
            onOk: async () => {
                const res = await network.teacher.useSignOut(activity_id, user_ids)
                if (res.length === 0) {
                    //没有错误的人返回
                    message.success('签退成功')
                    setTimeout(() => location.reload(), 500)
                }
                if (res.length > 0) {
                    students.map(item => {
                        if (res.includes(item.user.id)) {
                            whoWrong.push({
                                name: item.user.name
                            })
                        }
                    })
                    message.error(`${whoWrong.map(item => item.name)}不符合签退条件，请确认`)
                    setTimeout(() => location.reload(), 500)
                }
            },
            onCancel: () => {
                console.log('nocancel');
            }
        })
    },
    getExcel: () => {
        const { activity_id, students } = get()
        const ids = students.map(it => it.user.id)
        if (ids.length === 0) {
            message.warning('请先选择学生')
            return
        }
        Modal.confirm({
            title: '确认导出选中人员名单',
            onOk: async () => {
                await network.teacher.downloadActivityStudentsExcel(activity_id, ids);
            },
            onCancel: () => {
                console.log('cancel')
            },
        })
    },
    setState: (key) => (value) => {
        set(
            produce((draftState) => {
                draftState[key] = value
            })
        );
    },
}))