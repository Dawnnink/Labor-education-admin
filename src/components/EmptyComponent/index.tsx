import React from 'react';
import { Typography, Box } from '@mui/material';
import AllInboxIcon from '@mui/icons-material/AllInbox';
const EmptyComponent = ({ message }: any) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight={200}
        >
            <AllInboxIcon fontSize='large' />
            <Typography variant="body1">{message}</Typography>
        </Box>
    );
};

export default EmptyComponent;
