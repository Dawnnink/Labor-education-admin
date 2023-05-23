import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, IconButtonProps, Stack, Typography } from '@mui/joy'
import logoSvg from './logo.svg'

const Brand = () => {
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <img src={logoSvg} />
      <Typography level="h5">南昌大学劳动教育平台管理端</Typography>
    </Stack>
  )
}

export interface AppBarProps {
  onMenuClick?: IconButtonProps['onClick']
  showMenuButton?: boolean
}

export const AppBar = ({ onMenuClick, showMenuButton }: AppBarProps) => {
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={(theme) => ({
        height: 0o100,
        px: 2,
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,

        backdropFilter: 'blur(8px) saturate(180%)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        [theme.getColorSchemeSelector('dark')]: {
          backgroundColor: `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
        },
        borderColor: theme.vars.palette.neutral.outlinedBorder,
        borderWidth: '0px 0px thin',
        borderStyle: 'solid',
      })}
    >
      {showMenuButton && (
        <IconButton variant="plain" onClick={onMenuClick} size="sm">
          <MenuIcon />
        </IconButton>
      )}
      <Brand />
    </Stack>
  )
}
