import EventNoteIcon from '@mui/icons-material/EventNote';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from '@mui/joy';
import { useMatch } from 'react-router-dom';
import { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';

export interface NavListButtonProps {
  to: string;
  title: string;
  Icon: ComponentType;
  disabled?: boolean;
}

const NavListButton = ({ to, title, Icon, disabled }: NavListButtonProps) => {
  const match = useMatch(to + '/*');
  const navigate = useNavigate();

  return (
    <ListItemButton
      selected={!!match}
      variant={match ? 'soft' : undefined}
      onClick={() => {
        navigate(to);
        location.reload();
      }}
      disabled={disabled}
    >
      <ListItemDecorator>
        <Icon />
      </ListItemDecorator>
      <ListItemContent>{title}</ListItemContent>
    </ListItemButton>
  );
};

const links: NavListButtonProps[] = [
  { title: '活动大厅', to: '/dashboard', Icon: DashboardIcon, disabled: true },
  { title: '活动管理', to: '/activities', Icon: EventNoteIcon },
  { title: '权限管理', to: '/permission', Icon: ManageAccountsIcon, disabled: true },
];

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
  );
};
