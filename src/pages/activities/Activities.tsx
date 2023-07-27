import { Stack } from '@mui/joy'
import { ActivityTable } from '~/components/ActivityTable'
import { ErrorDisplay } from '~/components/ErrorDisplay'
import { OverflowWrapper } from '~/components/OverflowWrapper'
import { network } from '~/utils/network'
import { useEffect } from 'react'
const Activities = () => {
  const { data, error } = network.teacher.useActivities()
  useEffect(() => {
    const timer = setTimeout(() => {
      location.reload()
    }, 30000);
    return () => {
      clearTimeout(timer)
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
