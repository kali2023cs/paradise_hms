import React from 'react';
import { Paper, Typography, useTheme } from '@mui/material';

const RoomStatusCard = ({ status, count, color }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        textAlign: 'center',
        backgroundColor: color,
        color: '#ffffff',
        minWidth: 120,
        borderRadius: 2,
        flex: 1,
        maxWidth: 200
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        {count}
      </Typography>
      <Typography variant="subtitle2" textTransform="uppercase">
        {status.toUpperCase()}
      </Typography>
    </Paper>
  );
};

export default RoomStatusCard;