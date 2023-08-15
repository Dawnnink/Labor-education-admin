import { Box, Stack, Table, useTheme } from '@mui/joy'
import { GenderIcon } from '../GenderIcon'
import { ExpandableText } from '../ExpandableText'
import { User } from '~/utils/types'
import { StatusDot } from '../StatusDot'
import { Space, Button } from 'antd'
import { network } from '~/utils/network'
import { message } from 'antd'
import { Activity } from '~/utils/types'
export interface ActivityStudentsProps {
  students: {
    participate_time: string // ISO 8601
    participate_reason: string
    comment: string
    state: '报名成功' | '报名失败' | '报名审核中'
    check_in: string // ISO 8601
    check_out: string//签退
    notified: boolean | null //null不用通知，true已确认通知 false未确认通知
    user: User
    reject_reason: string//打回原因
  }[]
  id: number
  activity: Activity
}
export const ActivityStudents = ({ students, id }: ActivityStudentsProps) => {
  const theme = useTheme()
  console.log('themethemetheme', theme)
  const getColor = (status: string) => {
    switch (status) {
      case '报名成功':
        return theme.palette.success.solidBg
      case '报名失败':
        return theme.palette.danger.solidBg
      case '报名审核中':
        return theme.palette.warning.solidBg
      default:
        return theme.palette.neutral.solidBg
    }
  }

  function isArray<T,>(students: T): boolean {
    return Array.isArray(students)
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>学号</th>
          <th>专业</th>
          <th>班级</th>
          <th>申请理由</th>
          <th>活动状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {isArray(students) && students.map((student, i) => (
          <tr key={i}>
            <td>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box>{student.user.name}</Box>
                <GenderIcon gender={student.user.sex} />
              </Stack>
            </td>
            <td>{student.user.uid}</td>
            <td>{student.user.college}</td>
            <td>{student.user.class}</td>
            <td>
              <ExpandableText text={student.participate_reason} />
            </td>
            <td>
              <StatusDot status={student.state} getColor={getColor} />
            </td>{
              student.state == "报名审核中" &&
              <td
                style={{
                  display: 'flex',
                }}
              >
                <Space>
                  <Button
                    onClick={() => {
                      network.teacher.usePass(id, [student.user.id])
                        .then(() => {
                          message.success('通过成功')
                          setTimeout(() => location.reload(), 1000)
                        })
                        .catch(() => {
                          message.error('网络故障')
                        })
                    }}
                  >通过
                  </Button>
                  <Button
                    onClick={() => {
                      network.teacher.useReject(id, [student.user.id])
                        .then(() => {
                          message.success('拒绝成功')
                          setTimeout(() => location.reload(), 1000)
                        })
                        .catch(() => {
                          message.error('网络故障')
                        })
                    }}
                  >拒绝
                  </Button>
                </Space>

              </td>
            }

          </tr>
        ))}
        {isArray(students) && students.length === 0 && (
          <Box
            component="tr"
            sx={() => ({
              textAlign: 'center',
              opacity: 0.7,
            })}
          >
            <td colSpan={6}>暂无数据</td>
          </Box>
        )}
      </tbody>
    </Table>
  )
}
