
import {

    Paper,
    Button,
    MenuItem,
    Divider,
    MenuList,
    Grow,
    ClickAwayListener,
    Popper,
    Stack
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';


const Menu = () => {
    const [openPopper, setOpenPopper] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpenPopper((prevOpenPopper) => !prevOpenPopper)
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
    }

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenPopper(false);
        }
        else if (event.key === 'Escape') {
            setOpenPopper(false);
        }
    }

    const prevOpen = useRef(openPopper);
    useEffect(() => {
        if (prevOpen.current === true && openPopper === false) {
            anchorRef.current!.focus();
        }
        prevOpen.current = openPopper;
    }, [open])

    return (
        <Stack direction="row" spacing={2}>
            <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={openPopper ? 'composition-menu' : undefined}
                aria-expanded={openPopper ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                Dashboard
            </Button>
            <Popper
                open={openPopper}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
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
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleClose}>My account</MenuItem>
                                    <MenuItem onClick={handleClose}>Logout</MenuItem>
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