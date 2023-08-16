import { create } from 'zustand';
import { produce } from 'immer'
import { combine } from 'zustand/middleware'
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

export const useSendState = create<SendState>((set) => ({
    students: [],
    sendPass: (value) => {
        console.log('yes');
    },
    sendReject: (value) => {
        console.log('no');
    },
    sendBack: (value) => {
        console.log('back');
    },
    setState: (key) => (value) => {
        set(
            produce((draftState) => {
                draftState[key] = value
            })
        );
    },
}))