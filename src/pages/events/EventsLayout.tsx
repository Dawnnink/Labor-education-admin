import { Breadcrumbs, Link, Stack, Typography } from '@mui/joy'
import { Outlet } from 'react-router-dom'

const EventsLayout = () => {
  return (
    <Stack spacing={2}>
      <Breadcrumbs>
        <Link href="/events">活动管理</Link>
        <Typography fontSize="inherit">创建活动</Typography>
      </Breadcrumbs>

      <Outlet />
    </Stack>
  )
}

export default EventsLayout
