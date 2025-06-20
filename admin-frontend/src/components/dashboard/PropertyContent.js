import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Box, Grid, useTheme, Divider, styled, TextField, IconButton, Button
} from '@mui/material';
import {
  Business, Home, Email, Phone, Badge, LocationOn, Public, PinDrop, Apartment, Edit, Save
} from '@mui/icons-material';
import { useAuth } from '../../utils/AuthContext';
import api from '../../utils/axios';
import UILoader from '../common/UILoader';

const WhitePaper = styled(Paper)(({ theme }) => ({
  background: '#ffffff',
  color: theme.palette.text.primary,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  border: '1px solid rgba(0,0,0,0.05)'
}));

const DetailItem = ({ icon, label, value, field, editable, isEditing, handleChange }) => (
  <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{
      width: 40, height: 40, borderRadius: '50%',
      bgcolor: 'rgba(0,0,0,0.03)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      mr: 2, color: 'primary.main'
    }}>
      {React.cloneElement(icon, { sx: { color: 'primary.main' } })}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      {isEditing && editable ? (
        <TextField
          variant="standard"
          fullWidth
          value={value || ''}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      ) : (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {field === 'status' ? (value === 1 ? 'Active' : 'Inactive') : value || 'N/A'}
        </Typography>
      )}
    </Box>
  </Grid>
);

const PropertyContent = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [property, setProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.prop_id) {
      api.get(`/getproperty/${user.prop_id}`).then((res) => {
        setProperty(res.data.property);
        setEditedData(res.data.property);
      }).catch((err) => {
        console.error('Failed to load property:', err);
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    api.put(`/updateproperty/${property.id}`, editedData)
        .then((res) => {
        setIsEditing(false);
        setProperty(editedData); 
        setMessage(res.data.message); 
        setError('');
        })
        .catch((err) => {
        setError(err?.response?.data?.message || 'Something went wrong');
        setMessage('');
        console.error('Update failed:', err);
        });
    };

  if (!user) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>Property Management</Typography>
        <Typography color="text.secondary">No Property data available. Please log in.</Typography>
      </Paper>
    );
  }

  if (!property) {
    return <UILoader />;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <WhitePaper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>Property Details</Typography>
          {isEditing ? (
            <Button variant="contained" size="small" startIcon={<Save />} onClick={handleSave}>
              Save
            </Button>
          ) : (
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <DetailItem icon={<Business />} label="Property Name" field="property_name" value={editedData.property_name} isEditing={isEditing} editable handleChange={handleChange} />
          <DetailItem icon={<Home />} label="Property Code" field="property_code" value={editedData.property_code} isEditing={false} />
          <DetailItem icon={<LocationOn />} label="Address" field="address" value={editedData.address} isEditing={isEditing} editable handleChange={handleChange} />
          <DetailItem icon={<Apartment />} label="City" field="city" value={editedData.city} isEditing={isEditing} editable handleChange={handleChange} />
          <DetailItem icon={<Apartment />} label="State" field="state" value={editedData.state} isEditing={isEditing} editable handleChange={handleChange} />
          <DetailItem icon={<Public />} label="Country" field="country" value={editedData.country} isEditing={isEditing} editable handleChange={handleChange} />
          <DetailItem icon={<PinDrop />} label="Zip Code" field="zip_code" value={editedData.zip_code} isEditing={isEditing} editable handleChange={handleChange} />
          <DetailItem icon={<Phone />} label="Contact Number" field="contact_number" value={editedData.contact_number} isEditing={isEditing} editable handleChange={handleChange} />
          <DetailItem icon={<Email />} label="Email" field="email" value={editedData.email} isEditing={isEditing} editable handleChange={handleChange} />
          <DetailItem icon={<Badge />} label="Status" field="status" value={editedData.status} isEditing={false} />
          <DetailItem icon={<Badge />} label="Company" value={user.company_name} isEditing={false} />
          <DetailItem icon={<Badge />} label="Created At" value={property.created_at} isEditing={false} />
          <DetailItem icon={<Badge />} label="Updated At" value={property.updated_at} isEditing={false} />
        </Grid>
      </WhitePaper>
    </Box>
  );
};

export default PropertyContent;
