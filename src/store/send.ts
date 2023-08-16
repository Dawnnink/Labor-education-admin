import { create } from 'zustand';
import { produce } from 'immer'
import { Modal, message } from 'antd'
import { User } from '~/utils/types';

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
    sendPass: (value: any) => void;
    sendReject: (value: any) => void;
    sendBack: (value: any) => void; //签退
    setState: <T extends keyof SendState>(
        key: T
    ) => (value: SendState[T]) => void;
}

export const useSendState = create<SendState>((set, get) => ({
    students: [],
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
    sendReject: (value) => {
        const { students } = get();//获取当前的选中学生数据

    },
    sendBack: (value) => {
        const { students } = get();//获取当前的选中学生数据
    },
    setState: (key) => (value) => {
        set(
            produce((draftState) => {
                draftState[key] = value
            })
        );
    },
}))