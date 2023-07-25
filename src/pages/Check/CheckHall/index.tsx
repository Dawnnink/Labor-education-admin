import React, { FC } from 'react'
import { ReadOnlyEditor } from '~/components/ReadOnlyEditor'
import { network } from '~/utils/network'
import onOrigin from '~/utils/FormOrigin'
import { Department } from '~/utils/types'
import ReadOnlyTime from '~/utils/hooks/ReadOnlyTime'
import { Box } from '@mui/material'
export const CheckHall: FC = () => {
    const params: string = window.location.pathname;
    //使用正则表达式获取路径参数
    const regex = /\/(\d+)$/;
    const match = params.match(regex);

    let Id = match ? match[1] : null;
    if (!Id) {
        Id = '0'
    }
    const { data } = network.admin.useActivity(parseInt(Id as string))
    const { data: department } = network.teacher.useDepartment()
    console.log('afsfasfsfs', data)
    if (!data) {
        return <>Loading...
        </>
    }
    const newData = ReadOnlyTime(data)
    const lastData = onOrigin(newData, department as Department[])
    return (
        <Box>
            <ReadOnlyEditor initialActivity={lastData} canPass={true} canReject={true} />
        </Box>
    )
}
