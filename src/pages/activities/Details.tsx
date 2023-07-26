import { Button, Stack } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { ActivityEditor } from '~/components/ActivityEditor'
import { ActivityStudents } from '~/components/ActivityStudents'
import { ErrorDisplay } from '~/components/ErrorDisplay'
import { OverflowWrapper } from '~/components/OverflowWrapper'
import { network } from '~/utils/network'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import dayjs from 'dayjs'
import style from './index.module.css'
import { IParticipater } from '~/utils/types'
import { message } from 'antd'
function formatTime(timeString: string): string {
  const inputDate = new Date(timeString);
  const year = inputDate.getUTCFullYear().toString().padStart(4, '0');
  const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = inputDate.getUTCDate().toString().padStart(2, '0');
  const hours = inputDate.getUTCHours().toString().padStart(2, '0');
  const minutes = inputDate.getUTCMinutes().toString().padStart(2, '0');
  const seconds = inputDate.getUTCSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const DetailsWithParams = ({ activityId }: { activityId: number }) => {
  const { data: activity, error } = network.teacher.useActivity(activityId)
  const { data: students } = network.teacher.useActivityStudents(activityId)
  console.log('这里是activity', activity)
  console.log('这里是student', students);
  const studentArray: number[] = [];
  if (students) {
    studentArray.push(
      ...students.map((item: IParticipater) => {
        return item.user.id
      })
    )
  }
  if (activity) {
    if (activity.state == '已发布' || activity.state == '审核中') {
      if (dayjs().isBefore(dayjs(formatTime(activity.registration_start_time)))) {
        return (
          <Stack
            spacing={2}
            sx={{
              width: '100%',
            }}
          >
            <ErrorDisplay error={error} />
            <OverflowWrapper>
              {students === undefined ? null : <ActivityStudents students={students} id={activity.id} />}
            </OverflowWrapper>
            <Stack direction="row" justifyContent="flex-end" p={'0 20px'} alignItems='flex-end'>
              <Button
                startDecorator={<FileDownloadIcon />}
                onClick={() => {
                  network.teacher.downloadActivityStudentsExcel(activityId)
                }}
              >
                导出学生列表
              </Button>
            </Stack>
            {activity && <ActivityEditor initialActivity={activity} isShow={false} disabled={true} beginDel={true} isDel={true} />}
          </Stack>
        )
      }
    }
  }
  if (!activity) {
    return (
      <div className={style.box}>
        Loading...
      </div >
    ) // 或者显示其他加载中的内容

  }
  console.log('是的，现在待报名', activity.id)

  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
      }}
    >
      <ErrorDisplay error={error} />
      <OverflowWrapper>
        {students === undefined ? null : <ActivityStudents students={students} id={activity.id} />}
      </OverflowWrapper>
      <Stack direction="row" justifyContent="space-between" p={'0 20px'} alignItems='flex-end'>
        <Button
          onClick={() => {
            network.teacher.usePass(activity.id, studentArray)
              .then(() => {
                message.success('一键通过成功')
                setTimeout(() => location.reload(), 1000)
              })
              .catch(() => {
                message.error('网络故障')
              })
          }}
        >
          全部通过
        </Button>
        <Button
          startDecorator={<FileDownloadIcon />}
          onClick={() => {
            network.teacher.downloadActivityStudentsExcel(activityId)
          }}
        >
          导出学生列表
        </Button>
      </Stack>
      {activity && <ActivityEditor initialActivity={activity} isShow={false} disabled={true} />}
    </Stack >
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
