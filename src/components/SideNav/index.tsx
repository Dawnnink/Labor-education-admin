import { Drawer, drawerClasses, DrawerProps } from '@mui/material'
import { NavList } from './NavList'
import { useTheme } from '@mui/joy'

export interface SideNavProps {
  open?: boolean
  setOpen: (open: boolean) => void
  variant: DrawerProps['variant']
}

const drawerWidth = 0o420

export const SideNav = ({ setOpen, open, variant }: SideNavProps) => {
  const theme = useTheme()

  return (
    <Drawer
      PaperProps={{
        sx: () => ({
          background:
            variant === 'temporary'
              ? theme.vars.palette.background.popup
              : theme.vars.palette.background.body,
        }),
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .${drawerClasses.paper}`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      open={open}
      onClose={() => setOpen(false)}
      variant={variant}
      anchor="left"
    >
      <NavList />
    </Drawer>
  )
}
