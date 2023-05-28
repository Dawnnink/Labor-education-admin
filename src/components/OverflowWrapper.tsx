import { Box, Stack } from '@mui/joy'
import { ReactNode } from 'react'

export const OverflowWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      sx={{
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <Box sx={{ minWidth: '600px' }}>{children}</Box>
    </Stack>
  )
}
