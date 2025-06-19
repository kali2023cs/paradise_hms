import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from '../../../../src/utils/axios';
import UILoader from "../../common/UILoader";

const MaintenanceRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    room_id: '',
    maintenance_type_id: '',
    maintenance_status_id: '',
    issue_description: '',
    reported_by: ''
  });

  const [rooms, setRooms] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQuickResolve, setIsQuickResolve] = useState(false);
  const [resolvedStatusId, setResolvedStatusId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load master data
  useEffect(() => {
  const fetchMasters = async () => {
    try {
      const res = await api.get('/maintenance-masters');
      if (res.data.success) {
        setRooms(res.data.rooms);
        setMaintenanceTypes(res.data.maintenanceTypes);
        setStatuses(res.data.statuses);
        setStaff(res.data.staff);

        // Find resolved status ID
        const resolvedStatus = res.data.statuses.find(s => 
          s.status_name.toLowerCase() === 'resolved'
        );
        setResolvedStatusId(resolvedStatus?.id);

        // Check if we have pre-selected room from navigation state
        if (location.state?.preSelectedRoom?.roomId) {
          const isResolveFlow = location.state.preSelectedRoom.status === 'resolved';
          setIsQuickResolve(isResolveFlow);

          setFormData(prev => ({
            ...prev,
            room_id: location.state.preSelectedRoom.roomId,
            maintenance_status_id: isResolveFlow ? (resolvedStatus?.id || '') : ''
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching master data:", error);
      setSnackbar({
        open: true,
        message: 'Error loading master data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  fetchMasters();
}, [location.state]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      let endpoint = '/report-maintenance';
      let payload = formData;

      if (isQuickResolve) {
        endpoint = '/resolve-maintenance';
        payload = {
          room_id: formData.room_id,
          maintenance_status_id: formData.maintenance_status_id,
          remarks: formData.issue_description
        };
      }

      const response = await api.post(endpoint, payload);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: response.data.message || 
            (isQuickResolve ? 'Maintenance resolved successfully!' : 'Maintenance reported successfully!'),
          severity: 'success'
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to process maintenance',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error processing maintenance',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return <UILoader />;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5">
          {isQuickResolve ? 'Resolve Maintenance' : 'Report Maintenance'}
        </Typography>

        {/* Room Selection */}
        <TextField
          select
          name="room_id"
          label="Room"
          value={formData.room_id}
          onChange={handleChange}
          fullWidth
          required
          disabled={isQuickResolve}
        >
          <MenuItem value="">Select Room</MenuItem>
          {rooms.map(room => (
            <MenuItem key={room.id} value={room.id}>
              {room.room_no || room.id}
            </MenuItem>
          ))}
        </TextField>

        {/* Only show maintenance type when reporting */}
        {!isQuickResolve && (
          <TextField
            select
            name="maintenance_type_id"
            label="Maintenance Type"
            value={formData.maintenance_type_id}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="">Select Maintenance Type</MenuItem>
            {maintenanceTypes.map(type => (
              <MenuItem key={type.id} value={type.id}>
                {type.issue_type}
              </MenuItem>
            ))}
          </TextField>
        )}

        {/* Status Selection */}
        <TextField
          select
          name="maintenance_status_id"
          label="Maintenance Status"
          value={formData.maintenance_status_id}
          onChange={handleChange}
          fullWidth
          required
          disabled={isQuickResolve}
        >
          <MenuItem value="">Select Status</MenuItem>
          {statuses.map(status => (
            <MenuItem key={status.id} value={status.id}>
              {status.status_name}
            </MenuItem>
          ))}
        </TextField>

        {/* Issue Description (or Remarks for resolution) */}
        <TextField
          name="issue_description"
          label={isQuickResolve ? 'Resolution Remarks' : 'Issue Description'}
          value={formData.issue_description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          required={!isQuickResolve}
        />

        {/* Only show reporter selection when reporting */}
        {!isQuickResolve && (
          <TextField
            select
            name="reported_by"
            label="Reported By"
            value={formData.reported_by}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">Select Staff</MenuItem>
            {staff.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={
            isQuickResolve 
              ? !formData.room_id || !formData.maintenance_status_id
              : !formData.room_id || !formData.maintenance_type_id || 
                !formData.maintenance_status_id || !formData.issue_description
          }
          fullWidth
          size="large"
        >
          {isQuickResolve ? 'Mark as Resolved' : 'Report Maintenance'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MaintenanceRoom;