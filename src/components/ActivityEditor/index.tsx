import { Stack } from '@mui/joy'

export interface ActivityEditorProps {
  activityId: number | null
}

export const ActivityEditor = ({ activityId }: ActivityEditorProps) => {
  const disabled = activityId === null

  return (
    <Stack spacing={2}>
      <div>活动编辑器: {activityId}</div>
    </Stack>
  )
}
