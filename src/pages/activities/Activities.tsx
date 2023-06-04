import { Stack } from '@mui/joy'
import { ActivityTable } from '~/components/ActivityTable'
import { ErrorDisplay } from '~/components/ErrorDisplay'
import { network } from '~/utils/network'

const Activities = () => {
  const { data, error } = network.teacher.useActivities()
  return (
    <Stack spacing={2}>
      <ErrorDisplay error={error} />
      {data && <ActivityTable activities={data} />}
    </Stack>
  )
}

export default Activities
