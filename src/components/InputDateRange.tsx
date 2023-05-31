import { FormLabel, Input, Stack, useTheme } from '@mui/joy'

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { useMediaQuery } from '@mui/material'

export interface InputDateRangeProps {
  dates: [string, string]
  onChange: (newDates: [string, string]) => void
  label: string

  disabled?: boolean
}

export const InputDateRange = ({
  dates,
  onChange,
  label,
  disabled,
}: InputDateRangeProps) => {
  const theme = useTheme()
  const downSm = useMediaQuery(theme.breakpoints.up('sm'))

  const handleDateChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDates = [...dates]
      newDates[index] = event.target.value
      onChange(newDates as [string, string])
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
