import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Paper,
    Button,
    MenuItem,
    MenuList,
    Grow,
    ClickAwayListener,
    Popper,
    Stack,
    Box
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
interface MenuProps {
    handleKind: (e: string) => void;
    now: string;
}

const Menu = (props: MenuProps) => {
    const { handleKind, now } = props;//解构
    const [openPopper, setOpenPopper] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [isClicked, setIsClicked] = useState(false);//判断Menu是否被点击

    const handleToggle = () => {
        setOpenPopper((prevOpenPopper) => !prevOpenPopper)
        setIsClicked((prevIsClicked) => !prevIsClicked)
    }

    const handleClose = (
        event: Event | React.SyntheticEvent
    ) => {
        if (
            anchorRef.current
            &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setOpenPopper(false)
        if ((event.target as HTMLElement).textContent) {
            if (
                ['全部', '已签退', '待签退', '待审核', '待签到'].includes(((event.target as HTMLElement).textContent) as string)
            ) {
                handleKind((event.target as HTMLElement).textContent as string);
            }
        }
        setIsClicked(false);

    }

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenPopper(false);
            setIsClicked(false);
        }
        else if (event.key === 'Escape') {
            setOpenPopper(false);
            setIsClicked(false);
        }
    }

    const prevOpen = useRef(openPopper);
    useEffect(() => {
        if (prevOpen.current === true && openPopper === false) {
            anchorRef.current!.focus();
        }
        prevOpen.current = openPopper;
    }, [open])
    const prop = {
        sx: {
            zIndex: '10000'
        }
    }
    return (
        <Stack direction="row" spacing={2} sx={{ pl: 3 }}>
            <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={openPopper ? 'composition-menu' : undefined}
                aria-expanded={openPopper ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                sx={{
                    width: '210px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#A99D9C',
                    border: isClicked ? '1px solid #1677FF' : '1px solid grey',
                }}
            >
                {now}
                <Box
                    sx={{
                        transform: isClicked ? 'rotate(-180deg)' : null,
                        transition: 'all 1s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ExpandMoreIcon />
                </Box>
            </Button>
            <Popper
                open={openPopper}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                {...prop}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}

                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={openPopper}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                    sx={{
                                        width: '210px',
                                    }}

                                >
                                    <MenuItem onClick={handleClose}>全部</MenuItem>
                                    <MenuItem onClick={handleClose}>待审核</MenuItem>
                                    <MenuItem onClick={handleClose}>待签退</MenuItem>
                                    <MenuItem onClick={handleClose}>已签退</MenuItem>
                                    <MenuItem onClick={handleClose}>待签到</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Stack>
    )
}


export default Menu;