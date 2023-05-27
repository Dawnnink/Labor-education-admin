import { Stack } from '@mui/joy'

export interface EventEditorProps {
  eventId: number | null
}

export const EventEditor = ({ eventId }: EventEditorProps) => {
  const disabled = eventId === null

  return (
    <Stack spacing={2}>
      <div>活动编辑器: {eventId}</div>
    </Stack>
  )
}
