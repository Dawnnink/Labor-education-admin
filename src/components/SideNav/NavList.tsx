import EventNoteIcon from '@mui/icons-material/EventNote'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from '@mui/joy'
import { Link, useMatch } from 'react-router-dom'
import { ComponentType } from 'react'

export interface NavListButtonProps {
  to: string
  title: string
  Icon: ComponentType
}

const NavListButton = ({ to, title, Icon }: NavListButtonProps) => {
  const match = useMatch(to + '/*')
  return (
    <ListItemButton
      selected={!!match}
      variant={match ? 'soft' : undefined}
      component={Link}
      to={to}
    >
      <ListItemDecorator>
        <Icon />
      </ListItemDecorator>
      <ListItemContent>{title}</ListItemContent>
    </ListItemButton>
  )
}

const links: NavListButtonProps[] = [
  { title: '活动大厅', to: '/dashboard', Icon: DashboardIcon },
  { title: '活动管理', to: '/activities', Icon: EventNoteIcon },
  { title: '权限管理', to: '/permission', Icon: ManageAccountsIcon },
]

export const NavList = () => {
  return (
    <List
      sx={{
        fontWeight: '500',
        userSelect: 'none',
      }}
    >
      {links.map((item) => (
        <ListItem key={item.to}>
          <NavListButton {...item} />
        </ListItem>
      ))}
    </List>
  )
}
