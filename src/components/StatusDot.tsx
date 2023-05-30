import { Box, Stack } from '@mui/joy'

export interface StatusDotProps {
  status: string
  size?: number
  getColor: (status: string) => string
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  size = 8,
  getColor,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        sx={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: getColor(status),
          transform: 'translateY(1px)',
        }}
      />
      <Box>{status}</Box>
    </Stack>
  )
}
