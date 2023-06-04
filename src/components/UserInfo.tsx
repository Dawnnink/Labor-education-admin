import { Avatar, Button, Stack, Typography } from '@mui/joy'
import { useStore } from '~/utils/store'

export interface UserInfoProps {
  name: string
  avatarUrl?: string
}

export const UserInfo = ({ name, avatarUrl }: UserInfoProps) => {
  const logout = useStore((state) => state.logout)
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar src={avatarUrl} color="info">
          {name[0]}
        </Avatar>
        <Typography level="body2">{name}</Typography>
      </Stack>
      <Button variant="soft" size="sm" onClick={logout}>
        登出
      </Button>
    </Stack>
  )
}
