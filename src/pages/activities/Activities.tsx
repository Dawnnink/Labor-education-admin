import { Stack } from '@mui/joy'
import { ActivityTable } from '~/components/ActivityTable'
import { ErrorDisplay } from '~/components/ErrorDisplay'
import { OverflowWrapper } from '~/components/OverflowWrapper'
import { network } from '~/utils/network'
import ActivitiesLayout from '~/pages/activities/ActivitiesLayout'
const Activities = () => {
  const { data, error } = network.teacher.useActivities()
  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
      }}
    >

      <ErrorDisplay error={error} />
      {data && (
        <OverflowWrapper>
          <ActivityTable />
        </OverflowWrapper>
      )}
    </Stack>
  )
}

export default Activities
