import { Box, Stack } from '@mui/joy'
import { Activity } from '~/utils/types'

/**
 *
 * @returns A component of a dot with different colors representing different activity status and the status name.
 */
export const ActivitiesStatus = ({
  status,
  size = 8,
}: {
  status: Activity['state']
  size?: number
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        sx={(theme) => {
          const backgroundColor =
            status === '审核中'
              ? theme.palette.warning.solidBg
              : status === '审核失败'
              ? theme.palette.danger.solidBg
              : status === '已发布'
              ? theme.palette.success.solidBg
              : theme.palette.neutral.solidBg
          return {
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor,
            transform: 'translateY(1px)',
          }
        }}
      />
      <Box>{status}</Box>
    </Stack>
  )
}
