import { useMemo } from 'react';
import { IChange } from './CheckChange';
export function ChangeForm(columnsData: string[][], rowsData: IChange[]) {
    const columns = useMemo(() => {
        return columnsData.map((item: any) => {
            return {
                key: item[0],
                dataIndex: item[0],
                title: item[1],
            }
        })
    }, [columnsData]);

    const rows = useMemo(() => {
        return rowsData.map((item: IChange, index: number) => {
            return {
                key: index,
                ...item,
            }
        })
    }, [rowsData]);

    return {
        columns,
        rows
    }
}
