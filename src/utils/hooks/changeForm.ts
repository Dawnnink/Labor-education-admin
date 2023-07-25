import React, { useMemo } from 'react';
import { IAdActivity } from '~/pages/Check/CheckTable';
export function ChangeForm(columnsData: string[][], rowsData: IAdActivity[]) {
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
        return rowsData.map((item: IAdActivity, index: number) => {
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
