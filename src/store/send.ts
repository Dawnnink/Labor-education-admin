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
    sendPass: (value: any) => void;
    sendReject: (value: any) => void;
    sendBack: (value: any) => void; //签退
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
    sendPass: () => {
        const { students } = get();//获取当前的选中学生数据
        Modal.confirm({
            title: '确认通过审核？',
            onOk: async () => {
                console.log('ok')
            },
            onCancel: () => {
                console.log('cancel');
            },
        })
    },
    sendReject: () => {
        const { students, reason, activity_id } = get();//获取当前的选中学生数据
        const ids = students.map(it => it.user.id);
        const users: Array<RejectUsers> = [];
        ids.map((item) => {
            users.push({
                reason: reason,
                user_id: item,
            })
        })
        Modal.confirm({
            title: '确认打回审核',
            onOk: async () => {
                console.log('ok')
                console.log(activity_id);
                console.log(users)
                network.teacher.useReject(activity_id, users)//2个参数，users是个数组
            },
            onCancel: () => {
                console.log('nocancel');

            }
        })
    },
    sendBack: (value) => {
        const { students } = get();//获取当前的选中学生数据
        Modal.confirm({
            title: '确认一键签退',
            onOk: async () => {
                console.log('ok')
            },
            onCancel: () => {
                console.log('nocancel');
            }
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