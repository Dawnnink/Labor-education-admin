import { Stack } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { ActivityEditor } from '~/components/ActivityEditor'
import { ActivityStudents } from '~/components/ActivityStudents'
import { OverflowWrapper } from '~/components/OverflowWrapper'

const Details = () => {
  const { id } = useParams()
  const activityId = Number(id)
  if (isNaN(activityId)) {
    return <div>无效的路径参数：活动 ID</div>
  }
  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
      }}
    >
      <Stack direction="row" spacing={2}></Stack>
      <OverflowWrapper>
        <ActivityStudents students={[]} />
      </OverflowWrapper>
      <ActivityEditor activityId={activityId} />
    </Stack>
  )
}

export default Details
