import { Container, Stack, useTheme } from '@mui/joy'
import { useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppBar } from '~/components/AppBar'
import { SideNav } from '~/components/SideNav'

const Index = () => {
  const theme = useTheme()

  const upLg = useMediaQuery(theme.breakpoints.up('lg'))

  const [temporaryDrawerOpen, setTemporaryDrawerOpen] = useState(upLg)

  const drawerOpen = upLg || temporaryDrawerOpen

  useEffect(() => {
    setTemporaryDrawerOpen(false)
  }, [upLg])

  return (
    <Stack direction="row">
      <SideNav
        open={drawerOpen}
        setOpen={setTemporaryDrawerOpen}
        variant={upLg ? 'permanent' : 'temporary'}
      />
      <Stack
        component="main"
        flex={1}
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === 'light' ? '#fbfbfb' : undefined,
          minHeight: '100vh',
        })}
      >
        <AppBar
          onMenuClick={() => setTemporaryDrawerOpen((v) => !v)}
          showMenuButton={!upLg}
        />
        <Container
          sx={{
            py: 2,
          }}
        >
          <Outlet />
        </Container>
      </Stack>
    </Stack>
  )
}
export default Index
