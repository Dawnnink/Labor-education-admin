import { Box, Stack, Table } from '@mui/joy'
import { GenderIcon } from '../GenderIcon'
import { ExpandableText } from '../ExpandableText'

export interface ActivityStudentsProps {
  activityId: number
}

export const ActivityStudents = ({ activityId }: ActivityStudentsProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>学号</th>
          <th>专业</th>
          <th>班级</th>
          <th>申请理由</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box>张三</Box>
              <GenderIcon gender="女" />
            </Stack>
          </td>
          <td>2018210000</td>
          <td>计算机科学与技术</td>
          <td>计科1801</td>
          <td>
            <ExpandableText text={'计算机科学与技术计算机科学与技技'} />
          </td>
        </tr>
        <tr>
          <td>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box>张三</Box>
              <GenderIcon gender="男" />
            </Stack>
          </td>
          <td>2018210000</td>
          <td>计算机科学与技术</td>
          <td>计科1801</td>
          <td>
            <ExpandableText
              text={
                'wsawtwdad wt awtdaw dwadh aw d wah a wwahwd \n watwad w haw'
              }
            />
          </td>
        </tr>
      </tbody>
    </Table>
  )
}
