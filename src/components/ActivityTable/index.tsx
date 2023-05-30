import { Box, Link, Table, useTheme } from '@mui/joy'
import { Activity } from '~/utils/types'
import { Link as RouterLink } from 'react-router-dom'
import { StatusDot } from '../StatusDot'

export interface ActivityTableProps {
  activities: Activity[]
}

export const ActivityTable = ({
  activities = [
    {
      id: 1,
      name: '活动1',
      state: '审核失败',
      enroll_number: 10,
      quota: 100,
      activity_end_time: '2021-10-10T00:00:00.000Z',
      activity_start_time: '2021-10-10T00:00:00.000Z',
    },
  ],
}: ActivityTableProps) => {
  const theme = useTheme()
  const getColor = (status: string) => {
    switch (status) {
      case '审核成功':
        return theme.palette.success.solidBg
      case '审核失败':
        return theme.palette.danger.solidBg
      case '审核中':
        return theme.palette.warning.solidBg
      default:
        return theme.palette.neutral.solidBg
    }
  }
  return (
    <Table>
      <thead>
        <tr>
          <th>活动名称</th>
          <th>活动状态</th>
          <th>报名人数</th>
          <th>名额</th>
          <th>报名截至</th>
          <th>活动开始</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr key={activity.id}>
            <td>
              <Link component={RouterLink} to={`/activities/${activity.id}`}>
                {activity.name}
              </Link>
            </td>
            <td>
              <StatusDot status={activity.state} getColor={getColor} />
            </td>
            <td>{activity.enroll_number}</td>
            <td>{activity.quota}</td>
            <td>{new Date(activity.activity_end_time).toLocaleString()}</td>
            <td>{new Date(activity.activity_start_time).toLocaleString()}</td>
          </tr>
        ))}
        {activities.length === 0 && (
          <Box
            component="tr"
            sx={() => ({
              textAlign: 'center',
              opacity: 0.7,
            })}
          >
            <td colSpan={7}>暂无活动</td>
          </Box>
        )}
      </tbody>
    </Table>
  )
}
