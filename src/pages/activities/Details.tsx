import { Button, Stack } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { ActivityEditor } from '~/components/ActivityEditor'
import { ActivityStudents } from '~/components/ActivityStudents'
import { ErrorDisplay } from '~/components/ErrorDisplay'
import { OverflowWrapper } from '~/components/OverflowWrapper'
import { network } from '~/utils/network'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { ActivityStudentsProps } from '~/components/ActivityStudents'

const DetailsWithParams = ({ activityId }: { activityId: number }) => {
  const { data: activity, error } = network.teacher.useActivity(activityId)
  const { data: students } = network.teacher.useActivityStudents(activityId)
  console.log('students' + students)



  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
      }}
    >
      <ErrorDisplay error={error} />
      <OverflowWrapper>
        {students === undefined ? null : <ActivityStudents students={{ stuendet: students as ActivityStudentsProps }} />}
      </OverflowWrapper>
      <Stack direction="row" alignItems="flex-end">
        <Button
          startDecorator={<FileDownloadIcon />}
          onClick={() => {
            network.teacher.downloadActivityStudentsExcel(activityId)
          }}
        >
          导出学生列表
        </Button>
      </Stack>
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
