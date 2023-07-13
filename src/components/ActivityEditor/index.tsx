import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Input as JoyInput,
  Stack,
  Textarea,
  useTheme,
} from '@mui/joy'
import { FormEvent, useState } from 'react'
import { InputDateRange } from '../InputDateRange'
import { ImageUploader } from '../ImageUploader'
import { useMediaQuery } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import { Activity } from '~/utils/types'
import { NewActivity, network } from '~/utils/network'
export interface ActivityEditorProps {
  initialActivity: Activity | null
  disabled?: boolean
}

export const ActivityEditor = ({
  initialActivity,
  disabled,
}: ActivityEditorProps) => {
  const [activity, setActivity] = useState<Activity | NewActivity>(
    initialActivity ?? {
      name: '',
      description: '',
      poster: '',
      icon: '',
      position: '',
      contact_person: '',
      contact_phone_number: '',
      need_audit: false,
      quota: 0,
      registration_start_time: '',
      registration_end_time: '',
      activity_start_time: '',
      activity_end_time: '',
      department_id: 0,
    }
  )

  const [quotaString, setQuotaString] = useState<string>(
    activity.quota.toString() ?? ''
  )

  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    initialActivity?.department_id ?? null
  )

  const Input = (props: React.ComponentProps<typeof JoyInput>) => (
    <JoyInput disabled={disabled} {...props} />
  )

  const theme = useTheme()
  const underSm = useMediaQuery(theme.breakpoints.down('sm'))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (initialActivity === null) {
      network.teacher.createActivity(activity)
    } else {
      if (!('id' in activity)) {
        throw new Error('Expect Activity for updateActivity')
      }
      network.teacher.updateActivity(activity)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setActivity((prevActivity) => ({
      ...prevActivity,
      [name]: value,
    }))
  }

  const handleQuotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setQuotaString(value)
    setActivity((prevActivity) => ({
      ...prevActivity,
      quota: parseInt(value),
    }))
  }

  const handleActivityTimeChange = (value: [string, string]) => {
    setActivity((prevActivity) => ({
      ...prevActivity,
      activity_start_time: value[0],
      activity_end_time: value[1],
    }))
  }

  const handleRegistrationTimeChange = (value: [string, string]) => {
    setActivity((prevActivity) => ({
      ...prevActivity,

      registration_start_time: value[0],
      registration_end_time: value[1],
    }))
  }

  const handlePosterChange = (image: string | null) => {
    setActivity((prevActivity) => ({
      ...prevActivity,
      poster: image ?? '',
    }))
  }

  const handleIconChange = (image: string | null) => {
    setActivity((prevActivity) => ({
      ...prevActivity,
      icon: image ?? '',
    }))
  }

  const { data: departments } = network.teacher.useDepartment()

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <FormControl>
        <FormLabel>活动名称</FormLabel>
        <Input
          sx={{
            maxWidth: 300,
          }}
          placeholder="请输入活动名称"
          value={activity.name}
          name="name"
          onChange={handleChange}
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
          value={activity.description}
          name="description"
          onChange={handleChange}
        />
      </FormControl>

      <Stack direction={underSm ? 'column' : 'row'} spacing={underSm ? 2 : 4}>
        <Stack>
          <FormLabel>活动海报</FormLabel>
          <ImageUploader
            width={300}
            height={150}
            image={activity.poster || null}
            onChange={handlePosterChange}
          />
        </Stack>
        <Stack>
          <FormLabel>活动图标</FormLabel>
          <ImageUploader
            width={150}
            height={150}
            image={activity.icon || null}
            onChange={handleIconChange}
          />
        </Stack>
      </Stack>

      <Stack>
        <FormLabel>活动联系人</FormLabel>

        <Stack direction={underSm ? 'column' : 'row'} spacing={2}>
          <Input
            placeholder="姓名"
            sx={{ maxWidth: 200 }}
            startDecorator={<PersonIcon />}
            value={activity.contact_person}
            name="contact_person"
            onChange={handleChange}
          />
          <Input
            placeholder="电话"
            sx={{ maxWidth: 200 }}
            startDecorator={<LocalPhoneIcon />}
            type="tel"
            value={activity.contact_phone_number}
            name="contact_phone_number"
            onChange={handleChange}
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
          value={activity.position}
          name="position"
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>发布部门</FormLabel>
        <Autocomplete
          loading={!!departments}
          options={(departments ?? []).map((v) => v.id)}
          sx={{
            maxWidth: 250,
          }}
          placeholder="请选择发布部门"
          value={selectedDepartmentId}
          name="department"
          getOptionLabel={(option) =>
            departments?.find((v) => v.id === option)?.name ?? ''
          }
          onChange={(_, value) => setSelectedDepartmentId(value)}
        />
      </FormControl>

      <InputDateRange
        label="报名时间"
        dates={[
          activity.registration_start_time,
          activity.registration_end_time,
        ]}
        onChange={handleRegistrationTimeChange}
      />
      <InputDateRange
        label="活动时间"
        dates={[activity.activity_start_time, activity.activity_end_time]}
        onChange={handleActivityTimeChange}
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
          value={quotaString}
          onChange={handleQuotaChange}
        />
      </FormControl>
      <Checkbox
        label="报名需要审核"
        checked={activity?.need_audit || false}
        name="need_audit"
        onChange={handleChange}
      />
      <Stack direction="row" spacing={2}>
        {disabled ? null : initialActivity === null ? (
          <Button type="submit" variant="solid">
            创建活动
          </Button>
        ) : (
          <Button type="submit" variant="solid">
            更新活动
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
