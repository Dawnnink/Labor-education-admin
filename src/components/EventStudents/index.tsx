export interface EventStudentsProps {
  eventId: number
}

export const EventStudents = ({ eventId }: EventStudentsProps) => {
  return <div>EventStudents {eventId}</div>
}
