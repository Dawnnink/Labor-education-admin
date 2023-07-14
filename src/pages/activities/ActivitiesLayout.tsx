import { Breadcrumbs, Link, Stack, Typography, Button } from '@mui/joy'
import { useNavigate } from 'react-router-dom'

const ActivitiesLayout = () => {
  const Navigate = useNavigate();
  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
      }}
    >
      <Stack
        direction='row'
        justifyContent='space-between'
      >
        <Breadcrumbs>
          <Link href="/activities">活动管理</Link>
          <Typography fontSize="inherit">活动</Typography>
        </Breadcrumbs>
        <Button
          variant='outlined'
          onClick={() => { Navigate('/create') }}
        > ＋ 发布活动</Button>
      </Stack>
    </Stack>
  )
}

export default ActivitiesLayout
