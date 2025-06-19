import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  useTheme,
  Divider,
  Chip,
  styled
} from '@mui/material';
import {
  Business,
  Home,
  Email,
  Phone,
  Badge,
  LocationOn,
  AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../../utils/AuthContext';

const WhitePaper = styled(Paper)(({ theme }) => ({
  background: '#ffffff',
  color: theme.palette.text.primary,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  border: '1px solid rgba(0,0,0,0.05)'
}));

const DetailItem = ({ icon, label, value }) => (
  <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      bgcolor: 'rgba(0,0,0,0.03)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mr: 2,
      color: 'primary.main'
    }}>
      {React.cloneElement(icon, { sx: { color: 'primary.main' } })}
    </Box>
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  </Grid>
);

const UsersContent = () => {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Users Management
        </Typography>
        <Typography color="text.secondary">
          No user data available. Please log in.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <WhitePaper elevation={3}>
        <Box sx={{ p: 4, position: 'relative' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: 'center',
            mb: 4
          }}>
            <Avatar sx={{ 
              width: 100, 
              height: 100, 
              fontSize: 40, 
              bgcolor: 'primary.main', 
              color: '#fff',
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              mr: { sm: 4 },
              mb: { xs: 2, sm: 0 }
            }}>
              {user.user_name.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {user.user_name}
              </Typography>
              <Chip 
                label={user.role_name} 
                icon={<Badge />}
                sx={{ 
                  bgcolor: 'rgba(0,0,0,0.03)',
                  color: 'text.primary',
                  mt: 1,
                  '& .MuiChip-icon': { color: 'primary.main' }
                }} 
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', mb: 3 }} />

          <Grid container spacing={2}>
            <DetailItem 
              icon={<Email />} 
              label="Email" 
              value={user.user_email} 
            />
            
            <DetailItem 
              icon={<Business />} 
              label="Company" 
              value={`${user.company_name} (${user.company_code})`} 
            />
            
            <DetailItem 
              icon={<Home />} 
              label="Property" 
              value={user.property_name} 
            />
            
            <DetailItem 
              icon={<LocationOn />} 
              label="Location" 
              value={user.city} 
            />
            
            <DetailItem 
              icon={<Phone />} 
              label="Contact" 
              value={user.contact_number} 
            />
            
            <DetailItem 
              icon={<AccountCircle />} 
              label="Property Code" 
              value={user.property_code} 
            />
          </Grid>
        </Box>
        
        <Box sx={{ 
          bgcolor: 'rgba(0,0,0,0.02)', 
          p: 2, 
          display: 'flex', 
          justifyContent: 'center'
        }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </WhitePaper>
    </Box>
  );
};

export default UsersContent;