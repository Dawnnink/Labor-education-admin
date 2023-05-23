import { Stack } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { EventEditor } from '~/components/EventEditor'
import { EventStudents } from '~/components/EventStudents'

const Details = () => {
  const { id } = useParams()
  const eventId = Number(id)
  if (isNaN(eventId)) {
    return <div>无效的路径参数：活动 ID</div>
  }
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}></Stack>
      <EventStudents eventId={eventId} />
      <EventEditor eventId={eventId} />
    </Stack>
  )
}

export default Details
