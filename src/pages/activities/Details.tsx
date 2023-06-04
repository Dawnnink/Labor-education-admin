import { Stack } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { ActivityEditor } from '~/components/ActivityEditor'
import { ActivityStudents } from '~/components/ActivityStudents'
import { ErrorDisplay } from '~/components/ErrorDisplay'
import { OverflowWrapper } from '~/components/OverflowWrapper'
import { network } from '~/utils/network'

const DetailsWithParams = ({ activityId }: { activityId: number }) => {
  const { data: activity, error } = network.teacher.useActivity(activityId)
  const { data: students } = network.teacher.useActivityStudents(activityId)

  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
      }}
    >
      <ErrorDisplay error={error} />
      <OverflowWrapper>
        {students && <ActivityStudents students={students} />}
      </OverflowWrapper>
      {activity && <ActivityEditor initialActivity={activity} />}
    </Stack>
  )
}

const Details = () => {
  const { id } = useParams()
  const activityId = Number(id)
  if (isNaN(activityId)) {
    return <div>无效的路径参数：活动 ID</div>
  }
  return <DetailsWithParams activityId={activityId} />
}

export default Details
