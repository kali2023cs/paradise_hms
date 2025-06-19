import React from 'react';
import { Paper, Typography } from '@mui/material';

const SettingsContent = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#1976d2' }}>System Settings</Typography>
      <Typography>System settings content goes here</Typography>
    </Paper>
  );
};

export default SettingsContent;