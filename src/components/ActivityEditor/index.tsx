import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormLabel,
  Input as JoyInput,
  Stack,
  Textarea,
} from '@mui/joy'
import { FormEvent, useCallback } from 'react'
import { InputDateRange } from '../InputDateRange'

export interface ActivityEditorProps {
  activityId: number | null
}

export const ActivityEditor = ({ activityId }: ActivityEditorProps) => {
  const disabled = activityId === null

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const Input = useCallback(
    (props: React.ComponentProps<typeof JoyInput>) => (
      <JoyInput disabled={disabled} {...props} />
    ),
    [disabled]
  )

  return (
    <Stack component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <FormControl>
          <FormLabel>活动名称</FormLabel>
          <Input
            sx={{
              maxWidth: 300,
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>活动简介</FormLabel>
          <Textarea
            disabled={disabled}
            minRows={2}
            sx={{
              maxWidth: 400,
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>活动地点</FormLabel>
          <Input
            sx={{
              maxWidth: 300,
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>发布部门</FormLabel>
          <Autocomplete
            options={[]}
            sx={{
              maxWidth: 300,
            }}
          />
        </FormControl>
        <InputDateRange
          label="报名时间"
          initialDates={[null, null]}
          onChange={() => {}}
        />
        <InputDateRange
          label="活动时间"
          initialDates={[null, null]}
          onChange={() => {}}
        />
        <FormControl>
          <FormLabel>活动名额</FormLabel>
          <Input
            type="number"
            sx={{
              width: 120,
            }}
            endDecorator="人"
          />
        </FormControl>
        <Checkbox label="报名需要审核" />
      </Stack>
    </Stack>
  )
}
