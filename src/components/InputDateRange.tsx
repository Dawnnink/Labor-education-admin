import { FormLabel, Input, Stack, useTheme } from '@mui/joy'

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { useMediaQuery } from '@mui/material'
import { useState } from 'react'

export interface InputDateRangeProps {
  initialDates: [Date | null, Date | null]
  onChange: (newDates: [Date | null, Date | null]) => void
  label: string

  disabled?: boolean
}

const formatDate = (date: Date | null) => {
  if (date === null) return ''
  const local = new Date(date)
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return local.toJSON().slice(0, 16)
}

export const InputDateRange = ({
  initialDates,
  onChange,
  label,
  disabled,
}: InputDateRangeProps) => {
  const theme = useTheme()
  const downSm = useMediaQuery(theme.breakpoints.up('sm'))

  const [dates, setDates] = useState<[string, string]>([
    formatDate(initialDates[0]),
    formatDate(initialDates[1]),
  ])

  const handleDateChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDates = [...dates]
      newDates[index] = event.target.value
      setDates(newDates as [string, string])
      onChange(
        newDates.map((date) => (date ? new Date(date) : null)) as [
          Date | null,
          Date | null
        ]
      )
    }

  return (
    <Stack>
      <FormLabel>{label}</FormLabel>
      <Stack direction="row">
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center">
          <Input
            type="datetime-local"
            value={dates[0]}
            onChange={handleDateChange(0)}
            disabled={disabled}
          />
          {downSm ? (
            <KeyboardDoubleArrowRightIcon />
          ) : (
            <KeyboardDoubleArrowDownIcon
              sx={{
                fontSize: '1rem',
              }}
            />
          )}
          <Input
            type="datetime-local"
            value={dates[1]}
            onChange={handleDateChange(1)}
            disabled={disabled}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
