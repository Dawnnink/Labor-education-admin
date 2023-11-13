import { create } from 'zustand';
import { produce } from 'immer';

export interface IUtilsStateProps {
    name: string;
    setState: <T extends keyof IUtilsStateProps>(
        key: T
    ) => (value: IUtilsStateProps[T]) => void
}

export const useUtilsState = create<IUtilsStateProps>((set) => ({
    name: '',
    setState: (key) => (value) => {
        set(
            produce((draft) => {
                draft[key] = value;
            })
        )
    }
}))