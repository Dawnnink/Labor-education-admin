import { Breadcrumbs, Link, Stack, Typography } from '@mui/joy'
import { Outlet } from 'react-router-dom'

const ActivitiesLayout = () => {
  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
      }}
    >
      <Breadcrumbs>
        <Link href="/activities">活动管理</Link>
        <Typography fontSize="inherit">创建活动</Typography>
      </Breadcrumbs>

      <Outlet />
    </Stack>
  )
}

export default ActivitiesLayout
