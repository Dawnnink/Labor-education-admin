import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Input as JoyInput,
  Stack,
  Textarea,
  useTheme,
} from '@mui/joy'
import { FormEvent, useCallback } from 'react'
import { InputDateRange } from '../InputDateRange'
import { ImageUploader } from '../ImageUploader'
import { useMediaQuery } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import { Activity } from '~/utils/types'

export interface ActivityEditorProps {
  initialActivity: Activity | null
}

export const ActivityEditor = ({ initialActivity }: ActivityEditorProps) => {
  const disabled = initialActivity === null

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const Input = useCallback(
    (props: React.ComponentProps<typeof JoyInput>) => (
      <JoyInput disabled={disabled} {...props} />
    ),
    [disabled]
  )

  const theme = useTheme()

  const underSm = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Stack component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <FormControl>
          <FormLabel>活动名称</FormLabel>
          <Input
            sx={{
              maxWidth: 300,
            }}
            placeholder="请输入活动名称"
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
            placeholder="请输入活动简介"
          />
        </FormControl>

        <Stack direction={underSm ? 'column' : 'row'} spacing={underSm ? 2 : 4}>
          <Stack>
            <FormLabel>活动海报</FormLabel>
            <ImageUploader width={300} height={150} />
          </Stack>
          <Stack>
            <FormLabel>活动图标</FormLabel>
            <ImageUploader width={150} height={150} />
          </Stack>
        </Stack>

        <Stack>
          <FormLabel>活动联系人</FormLabel>

          <Stack direction={underSm ? 'column' : 'row'} spacing={2}>
            <Input
              placeholder="姓名"
              sx={{ maxWidth: 200 }}
              startDecorator={<PersonIcon />}
            />
            <Input
              placeholder="电话"
              sx={{ maxWidth: 200 }}
              startDecorator={<LocalPhoneIcon />}
              type="tel"
            />
          </Stack>
        </Stack>

        <FormControl>
          <FormLabel>活动地点</FormLabel>
          <Input
            startDecorator={<LocationOnIcon />}
            sx={{
              maxWidth: 300,
            }}
            placeholder="请输入活动地点"
          />
        </FormControl>
        <FormControl>
          <FormLabel>发布部门</FormLabel>
          <Autocomplete
            options={[]}
            sx={{
              maxWidth: 250,
            }}
            placeholder="请选择发布部门"
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
              width: 140,
            }}
            endDecorator={
              <Stack spacing={1} direction="row">
                <Divider orientation="vertical" />
                <Box>人</Box>
              </Stack>
            }
          />
        </FormControl>
        <Checkbox label="报名需要审核" />
      </Stack>
    </Stack>
  )
}
