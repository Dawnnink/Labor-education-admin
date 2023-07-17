import { Box, Stack, Table, useTheme } from '@mui/joy'
import { GenderIcon } from '../GenderIcon'
import { ExpandableText } from '../ExpandableText'
import { User } from '~/utils/types'
import { StatusDot } from '../StatusDot'
import { Space, Button } from 'antd'
import { network } from '~/utils/network'
export interface ActivityStudentsProps {
  students: {
    participate_time: string // ISO 8601
    participate_reason: string
    comment: string
    state: '报名成功' | '报名失败' | '报名审核中'
    check_in: string // ISO 8601
    user: User
  }[]
}
export const ActivityStudents = ({ students }: ActivityStudentsProps) => {
  const theme = useTheme()
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
          <th>报名状态</th>
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
                    onClick={() => { network.teacher.usePass(student.user.id) }}
                  >通过
                  </Button>
                  <Button
                    onClick={() => { network.teacher.useReject(student.user.id) }}
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
