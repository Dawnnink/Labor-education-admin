import { FC } from 'react'
import { ReadOnlyEditor } from '~/components/ReadOnlyEditor'
import { network } from '~/utils/network'
import onOrigin from '~/utils/FormOrigin'
import { Department } from '~/utils/types'
import { Backdrop, CircularProgress } from '@mui/material'
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
    if (!data) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        )
    }
    const lastData = onOrigin(data, department as Department[])
    return (
        <Box
            sx={{
                marginTop: '20px',
                marginLeft: '24px',
                backgroundColor: 'white',
            }}
        >
            <ReadOnlyEditor initialActivity={lastData} canPass={true} canReject={true} isShow={true} id={parseInt(Id)} />
        </Box>
    )
}
