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
  IconButton,
  Fade,
  Grow
} from '@mui/material';
import { 
  LockOutlined,
  EmailOutlined,
  Visibility,
  VisibilityOff,
  ArrowForward,
  VpnKeyOutlined,
  HomeOutlined
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';

// Replace with your actual image path
// import loginImage from '../assets/Login-logo.png';
import backgroundImg from '../assets/newbackgroung.jpg';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(4),
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  transition: 'all 0.5s ease',
  [theme.breakpoints.down('lg')]: {
    justifyContent: 'center',
    gap: theme.spacing(4),
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column-reverse',
    padding: theme.spacing(2),
  }
}));

const FormContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  maxWidth: '450px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  transition: 'all 0.5s ease',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(2),
    maxWidth: '100%',
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  borderRadius: '16px',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  '&:hover': {
    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.25)',
    transform: 'translateY(-3px)',
  }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '& .MuiButton-endIcon': {
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    '& .MuiButton-endIcon': {
      transform: 'translateX(4px)',
    }
  }
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [property_code, setPropertyCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, property_code);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error(err);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledContainer maxWidth={false} disableGutters>
      <Grow in={true} timeout={800}>
        <FormContainer>
          <StyledPaper elevation={3}>
            <Fade in={true} timeout={1000}>
              <div>
                <Avatar sx={{ 
                  m: 2, 
                  bgcolor: 'rgba(74, 20, 140, 0.9)', // Deep purple accent
                  width: 60, 
                  height: 60,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(15deg) scale(1.1)',
                    bgcolor: 'rgba(74, 20, 140, 1)'
                  }
                }}>
                  <LockOutlined sx={{ fontSize: 30 }} />
                </Avatar>
                
                <Typography component="h1" variant="h4" sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  textAlign: 'center',
                  background: 'linear-gradient(90deg, #4A148C 0%, #7B1FA2 100%)', // Purple gradient
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px'
                }}>
                  Welcome Back
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 4,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem',
                  color: '#5D4037' // Brownish text for better contrast
                }}>
                  Sign in to continue to your account
                </Typography>
                
                {error && (
                  <Typography 
                    color="error" 
                    sx={{ 
                      mb: 3,
                      width: '100%',
                      textAlign: 'center',
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      py: 1,
                      borderRadius: 1,
                      transition: 'all 0.3s ease',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <LockOutlined fontSize="small" />
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
                    label="Property Code"
                    value={property_code}
                    onChange={(e) => setPropertyCode(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeOutlined color="action" sx={{ opacity: 0.7 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                          transition: 'all 0.3s ease'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(74, 20, 140, 0.5)', // Purple accent
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(74, 20, 140, 0.8)',
                          boxShadow: '0 0 0 2px rgba(74, 20, 140, 0.2)'
                        },
                      },
                      '& .MuiInputLabel-root': {
                        transition: 'all 0.3s ease',
                        color: '#5D4037' // Brownish text
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'rgba(74, 20, 140, 0.8)'
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined color="action" sx={{ opacity: 0.7 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                          transition: 'all 0.3s ease'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(74, 20, 140, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(74, 20, 140, 0.8)',
                          boxShadow: '0 0 0 2px rgba(74, 20, 140, 0.2)'
                        },
                      },
                      '& .MuiInputLabel-root': {
                        transition: 'all 0.3s ease',
                        color: '#5D4037' // Brownish text
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'rgba(74, 20, 140, 0.8)'
                      }
                    }}
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
                          <VpnKeyOutlined color="action" sx={{ opacity: 0.7 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(74, 20, 140, 0.1)'
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                          transition: 'all 0.3s ease'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(74, 20, 140, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(74, 20, 140, 0.8)',
                          boxShadow: '0 0 0 2px rgba(74, 20, 140, 0.2)'
                        },
                      },
                      '& .MuiInputLabel-root': {
                        transition: 'all 0.3s ease',
                        color: '#5D4037' // Brownish text
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'rgba(74, 20, 140, 0.8)'
                      }
                    }}
                  />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    mb: 3,
                    transition: 'all 0.3s ease'
                  }}>
                    <Link 
                      href="/forgot-password" 
                      variant="body2" 
                      underline="hover" 
                      sx={{ 
                        color: '#5D4037',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        '&:hover': {
                          color: 'rgba(74, 20, 140, 0.8)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <LockOutlined fontSize="small" />
                      Forgot password?
                    </Link>
                  </Box>
                  
                  <AnimatedButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ 
                      py: 1.5,
                      mb: 3,
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(90deg, #4A148C 0%, #7B1FA2 100%)', // Purple gradient
                      boxShadow: '0 2px 4px rgba(74, 20, 140, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 4px 8px rgba(74, 20, 140, 0.4)',
                        background: 'linear-gradient(90deg, #38006B 0%, #6A1B9A 100%)'
                      }
                    }}
                  >
                    Sign In
                  </AnimatedButton>
                  
                  <Divider sx={{ 
                    my: 3,
                    position: 'relative',
                    '&::before, &::after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      width: '20px',
                      height: '1px',
                      background: 'rgba(0, 0, 0, 0.12)'
                    },
                    '&::before': {
                      left: 0
                    },
                    '&::after': {
                      right: 0
                    }
                  }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        px: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        position: 'relative',
                        color: '#5D4037'
                      }}
                    >
                      OR
                    </Typography>
                  </Divider>
                  
                  <Typography variant="body2" align="center" sx={{ 
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem',
                    color: '#5D4037'
                  }}>
                    Don't have an account?{' '}
                    <Link 
                      href="/register" 
                      fontWeight="600" 
                      underline="hover" 
                      sx={{ 
                        color: 'rgba(74, 20, 140, 0.8)',
                        '&:hover': {
                          color: 'rgba(74, 20, 140, 1)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </div>
            </Fade>
          </StyledPaper>
        </FormContainer>
      </Grow>
    </StyledContainer>
  );
};

export default Login;