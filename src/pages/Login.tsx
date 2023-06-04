import {
  Alert,
  Button,
  Card,
  Container,
  Stack,
  Input,
  Typography,
  FormControl,
  FormLabel,
} from '@mui/joy'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginBackground } from '~/components/LoginBackground'
import { network } from '~/utils/network'

export default function Login() {
  const [credentials, setCredentials] = useState({
    account: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    ;(async () => {
      try {
        setSubmitting(true)
        await network.login(credentials)
        navigate('/', { replace: true })
      } catch (err) {
        if (err instanceof AxiosError) {
          const message: string | undefined = err.response?.data.message
          setErrorMessage(message || err.message)
        } else if (err instanceof Error) {
          setErrorMessage(err.message)
        }
      } finally {
        setSubmitting(false)
      }
    })()
  }

  return (
    <>
      <LoginBackground />
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '95vh',
        }}
      >
        <Card
          sx={(theme) => ({
            p: 5,
            width: 0o600,
            maxWidth: 1,
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.5)'
                : 'rgba(255, 255, 255, 0.7)',
          })}
        >
          <Stack
            spacing={4}
            sx={{
              width: 1,
            }}
            component="form"
            alignItems="center"
            onSubmit={handleSubmit}
          >
            <Stack alignItems="center" spacing={1}>
              <Typography level="h4">学生劳动系统后台登录</Typography>
              <Typography level="body2">
                使用<b>云家园</b>账号登录
              </Typography>
            </Stack>
            <Stack
              spacing={3}
              sx={{
                width: 1,
                maxWidth: 0o450,
              }}
            >
              <FormControl>
                <FormLabel>账号</FormLabel>
                <Input
                  placeholder="请输入云家园账号"
                  color="primary"
                  fullWidth
                  required
                  value={credentials.account}
                  onChange={(event) => {
                    setCredentials({
                      ...credentials,
                      account: event.target.value,
                    })
                    if (!event.target.value && !credentials.password) {
                      setErrorMessage('')
                    }
                  }}
                  error={!!errorMessage}
                />
              </FormControl>
              <FormControl>
                <FormLabel>密码</FormLabel>
                <Input
                  placeholder="请输入密码"
                  type="password"
                  color="primary"
                  autoComplete="current-password"
                  fullWidth
                  required
                  value={credentials.password}
                  onChange={(event) => {
                    setCredentials({
                      ...credentials,
                      password: event.target.value,
                    })
                    if (!credentials.account && !event.target.value) {
                      setErrorMessage('')
                    }
                  }}
                  error={!!errorMessage}
                />
              </FormControl>
              {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            </Stack>

            <Button
              type="submit"
              sx={{
                width: 0o160,
              }}
              variant="soft"
              size="lg"
              loading={submitting}
            >
              登录
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  )
}
