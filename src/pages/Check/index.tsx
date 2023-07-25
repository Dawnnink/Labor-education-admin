import Stack from '@mui/material/stack'
import { Typography, Box } from '@mui/material'


export default function Check() {
    const title = (
        <Box
            sx={{
                height: 72,
            }}
        >
            <Box
                sx={{
                    height: 44,
                    margin: '12px 24px 16px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}
            >
                <Typography
                    sx={{
                        fontSize: 20,
                        fontFamily: 'Roboto',
                        lineHeight: 28,
                        fontWeight: 500,
                    }}
                >活动审核</Typography>
            </Box>
        </Box>
    )

    return (
        <Stack>
            {title}
            <CheckTable />
        </Stack>
    )
}
