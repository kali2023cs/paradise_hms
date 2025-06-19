import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Protected = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // or redirect to login
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Protected Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        This page is only accessible to authenticated users.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
    </Container>
  );
};

export default Protected;