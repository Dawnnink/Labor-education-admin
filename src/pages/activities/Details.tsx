import { Stack } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { ActivityEditor } from '~/components/ActivityEditor'
import { Activitiestudents } from '~/components/Activitiestudents'

const Details = () => {
  const { id } = useParams()
  const activityId = Number(id)
  if (isNaN(activityId)) {
    return <div>无效的路径参数：活动 ID</div>
  }
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}></Stack>
      <Activitiestudents activityId={activityId} />
      <ActivityEditor activityId={activityId} />
    </Stack>
  )
}

export default Details
