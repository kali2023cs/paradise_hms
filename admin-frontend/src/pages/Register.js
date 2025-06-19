import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Link,
  Paper,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  LockOutlined,
  EmailOutlined,
  PersonOutline,
  Visibility,
  VisibilityOff,
  ArrowForward
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';

// Replace with your actual image path
import registerImage from '../assets/hotel-login.jpg';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  overflow: 'auto',
  background: '#f5f5f5',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: 0
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(4, 0),
    minHeight: 'auto'
  }
}));

const FormContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  background: '#f5f5f5',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(4, 2),
    minHeight: 'auto'
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '450px',
  borderRadius: '16px',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
  margin: theme.spacing(2, 0)
}));

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error(err);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledContainer maxWidth={false} disableGutters>
      <ImageContainer>
        <img 
          src={registerImage} 
          alt="Register visual" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '80vh',
            objectFit: 'contain'
          }} 
        />
      </ImageContainer>
      
      <FormContainer>
        <StyledPaper elevation={0}>
          <Avatar sx={{ 
            m: 2, 
            bgcolor: 'primary.main', 
            width: 60, 
            height: 60 
          }}>
            <LockOutlined sx={{ fontSize: 30 }} />
          </Avatar>
          
          <Typography component="h1" variant="h4" sx={{ 
            fontWeight: 600, 
            mb: 1,
            textAlign: 'center'
          }}>
            Create Account
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ 
            mb: 4,
            textAlign: 'center'
          }}>
            Sign up to get started
          </Typography>
          
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 3,
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'error.light',
                py: 1,
                borderRadius: 1
              }}
            >
              {error}
            </Typography>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ 
            width: '100%',
            mt: 2,
            mb: 2
          }}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{ 
                py: 1.5,
                mb: 3,
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              Sign Up
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account?{' '}
              <Link href="/login" fontWeight="600" underline="hover">
                Sign in
              </Link>
            </Typography>
          </Box>
        </StyledPaper>
      </FormContainer>
    </StyledContainer>
  );
};

export default Register;