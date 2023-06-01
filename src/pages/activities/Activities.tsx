import { Stack } from '@mui/joy'
import { ActivityTable } from '~/components/ActivityTable'

const Activities = () => {
  return (
    <Stack>
      <ActivityTable
        activities={[
          {
            id: 1,
            name: '活动1',
            state: '审核失败',
            enroll_number: 10,
            quota: 100,
            activity_end_time: '2021-10-10T00:00:00.000Z',
            activity_start_time: '2021-10-10T00:00:00.000Z',
          },
        ]}
      />
    </Stack>
  )
}

export default Activities
