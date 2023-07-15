import { useMemo } from 'react';
import { showAct } from '~/utils/types'
export function ChangeData(columnsData: string[][], rowsData: showAct[][]) {
    //columnsData的格式一般是[["name","姓名"]，["name","姓名"]，["name","姓名"]，]
    const columns = useMemo(() => {
        return columnsData.map((item: any, index: number) => {
            return {
                key: item[0],
                dataIndex: item[0],
                title: item[1],
            }
        })
    }, [columnsData])
    const newRows: showAct[] = [];
    for (let i = 0; i < rowsData.length; i++) {
        for (let j = 0; j < rowsData[i].length; j++) {
            newRows.push(rowsData[i][j])
        }
    }
    const rows = useMemo(() => {
        return newRows.map((item: any, index: number) => {
            return {
                key: index,
                ...item,
            }

        })
    }, [rowsData])

    return {
        columns,
        rows,
    }
}