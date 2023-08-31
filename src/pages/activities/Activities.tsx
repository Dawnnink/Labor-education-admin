import { Stack } from '@mui/joy'
import { ActivityTable } from '~/components/ActivityTable'
import { ErrorDisplay } from '~/components/ErrorDisplay'
import { OverflowWrapper } from '~/components/OverflowWrapper'
import { network } from '~/utils/network'
import { useEffect } from 'react'
const Activities = () => {
  const { data, error } = network.teacher.useActivities()
  useEffect(() => {
    let count = 0
    const timer = setInterval(() => {
      count = count + 1
    }, 1000);
    return () => {
      clearInterval(timer)
    }
  }, [])
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
