export interface EventEditorProps {
  eventId: number | null
}

export const EventEditor = ({ eventId }: EventEditorProps) => {
  return <div>EventEditor {eventId}</div>
}
