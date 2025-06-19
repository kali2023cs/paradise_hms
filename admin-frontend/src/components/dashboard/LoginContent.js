import React from 'react';
import { Paper, Typography } from '@mui/material';

const LoginContent = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#1976d2' }}>Login</Typography>
      <Typography>Login form content goes here</Typography>
    </Paper>
  );
};

export default LoginContent;