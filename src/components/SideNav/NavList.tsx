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
import { network } from '~/utils/network';
import { IUser } from '~/utils/network';
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
        navigate(to, { replace: true });
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

import { useState, useEffect } from 'react'
export const NavList = () => {
  const [right, setRight] = useState<IUser | null | boolean>(null)
  useEffect(() => {
    const getRight = async () => {
      try {
        const data = await network.getRoot();
        setRight(data);
      }
      catch (err) {
        console.log('err')
      }
    }
    getRight();
  }, [])
  let whether = false;//决定能否进入活动审核
  if (right) {
    if ((right as IUser).role_ids.includes(3)) {
      whether = true;
    }
  }
  const links: NavListButtonProps[] = [
    { title: '活动大厅', to: '/dashboard', Icon: DashboardIcon, disabled: true },
    { title: '活动管理', to: '/activities', Icon: EventNoteIcon },
    { title: '活动审核', to: '/check', Icon: EventNoteIcon, disabled: !whether },
    { title: '权限管理', to: '/permission', Icon: ManageAccountsIcon, disabled: true },
  ];
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
