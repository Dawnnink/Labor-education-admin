import { Box, Stack } from '@mui/joy'
import { ActivityTable } from '~/components/ActivityTable'

const Activities = () => {
  return (
    <Stack>
      <ActivityTable activities={[]} />
    </Stack>
  )
}

export default Activities
