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

const CleanRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    room_id: '',
    cleaner_id: '',
    status_id: '',
    remarks: ''
  });

  const [rooms, setRooms] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQuickFinish, setIsQuickFinish] = useState(false);
  const [completedStatusId, setCompletedStatusId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load master data
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const res = await api.get('/cleaning-masters');
        if (res.data.success) {
          setRooms(res.data.rooms);
          setCleaners(res.data.cleaners);
          setStatuses(res.data.statuses);

          // Find completed status ID
          const completedStatus = res.data.statuses.find(s => 
            s.status_name.toLowerCase() === 'completed'
          );
          setCompletedStatusId(completedStatus?.id);

          // Check if we have pre-selected room from navigation state
          if (location.state?.preSelectedRoom?.roomId) {
            const quickFinish = location.state.preSelectedRoom.status === 'Finish';
            setIsQuickFinish(quickFinish);

            setFormData(prev => ({
              ...prev,
              room_id: location.state.preSelectedRoom.roomId,
              status_id: quickFinish ? (completedStatus?.id || '') : ''
            }));
          }
        } else {
          setSnackbar({
            open: true,
            message: 'Failed to load master data',
            severity: 'error'
          });
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
      let endpoint = '/clean-room';
      let payload = formData;

      if (isQuickFinish) {
        endpoint = '/finish-cleaning';
        payload = {
          room_id: formData.room_id,
          status_id: formData.status_id
        };
      }

      const response = await api.post(endpoint, payload);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: response.data.message || 'Room status updated successfully!',
          severity: 'success'
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to update room status',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error updating room status',
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
          {isQuickFinish ? 'Complete Room Cleaning' : 'Clean Room Form'}
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
          disabled={isQuickFinish}
        >
          <MenuItem value="">Select Room</MenuItem>
          {rooms.map(room => (
            <MenuItem key={room.id} value={room.id}>
              {room.room_no || room.id}
            </MenuItem>
          ))}
        </TextField>

        {/* Status Selection - always shown but different behavior */}
        <TextField
          select
          name="status_id"
          label="Cleaning Status"
          value={formData.status_id}
          onChange={handleChange}
          fullWidth
          required
          disabled={isQuickFinish}
        >
          <MenuItem value="">Select Status</MenuItem>
          {statuses.map(status => (
            <MenuItem key={status.id} value={status.id}>
              {status.status_name}
            </MenuItem>
          ))}
        </TextField>

        {/* Only show these fields when not in quick finish mode */}
        {!isQuickFinish && (
          <>
            <TextField
              select
              name="cleaner_id"
              label="Cleaner"
              value={formData.cleaner_id}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="">Select Cleaner</MenuItem>
              {cleaners.map(cleaner => (
                <MenuItem key={cleaner.id} value={cleaner.id}>
                  {cleaner.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="remarks"
              label="Remarks"
              value={formData.remarks}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </>
        )}

        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={
            isQuickFinish 
              ? !formData.room_id || !formData.status_id
              : !formData.room_id || !formData.cleaner_id || !formData.status_id
          }
          fullWidth
          size="large"
        >
          {isQuickFinish ? 'Mark as Completed' : 'Submit Cleaning'}
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

export default CleanRoom;