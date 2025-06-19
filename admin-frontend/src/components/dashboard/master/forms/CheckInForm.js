import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import styled from '@emotion/styled';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { PhotoCamera, InsertDriveFile, Add, Delete } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import api from '../../../../utils/axios';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { format, parseISO } from 'date-fns';

const UILoader = styled.div`
  width: 48px;
  height: 48px;
  margin: auto;
  position: relative;

  &:before {
    content: '';
    width: 48px;
    height: 5px;
    background: #999;
    position: absolute;
    top: 60px;
    left: 0;
    border-radius: 50%;
    animation: shadow324 0.5s linear infinite;
  }

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    background: rgb(61, 106, 255);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    animation: jump7456 0.5s linear infinite;
  }

  @keyframes jump7456 {
    15% {
      border-bottom-right-radius: 3px;
    }
    25% {
      transform: translateY(9px) rotate(22.5deg);
    }
    50% {
      transform: translateY(18px) scale(1, 0.9) rotate(45deg);
      border-bottom-right-radius: 40px;
    }
    75% {
      transform: translateY(9px) rotate(67.5deg);
    }
    100% {
      transform: translateY(0) rotate(90deg);
    }
  }

  @keyframes shadow324 {
    0%, 100% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(1.2, 1);
    }
  }
`;

// Corrected Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
Alert.displayName = 'Alert';

const MemoizedAlert = React.memo(Alert);

// Optimized custom hook for Snackbar
const useSnackbar = () => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const showSnackbar = useCallback((message, options = {}) => {
    setSnackbarState({
      open: true,
      message,
      severity: options.variant || 'info'
    });
  }, []);

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState(prev => ({ ...prev, open: false }));
  }, []);

  return {
    showSnackbar,
    snackbar: (
      <Snackbar open={snackbarState.open} autoHideDuration={6000} onClose={handleClose}>
        <MemoizedAlert onClose={handleClose} severity={snackbarState.severity} sx={{ width: '100%' }}>
          {snackbarState.message}
        </MemoizedAlert>
      </Snackbar>
    )
  };
};

const initialFormData = {
  is_reservation: false,
  reservation_number: '',
  arrival_mode: '',
  ota: '',
  booking_id: '',
  contact: '',
  title: '',
  first_name: '',
  last_name: '',
  gender: '',
  city: '',
  id_number: '',
  email: '',
  check_in_mode: 'Day',
  allow_credit: 'No',
  foreign_guest: 'No',
  segment_id: '',
  business_source_id: '',
  photo: null,
  document: null,
  gst_number: '',
  guest_company: '',
  age: '',
  gst_type: 'UNREGISTERED',
  address: '',
  visit_remark: '',
  pin_code: '',
  nationality: 'Indian',
  booking_instructions: '',
  guest_special_instructions: '',
  is_vip: false,
  check_in_type: '24 Hours CheckIn',
  check_in_datetime: new Date(),
  number_of_days: 1,
  check_out_datetime: new Date(Date.now() + 24 * 60 * 60 * 1000),
  grace_hours: 2,
  payment_by: 'Direct',
  allow_charges_posting: false,
  enable_paxwise: false,
  enable_room_sharing: false
};

const initialRoomDetail = {
  roomType: '',
  roomTypeId: '',
  roomNo: '',
  roomId: '',
  ratePlan: '',
  ratePlanId: '',
  mealPlan: '',
  guestName: '',
  contact: '',
  male: 0,
  female: 0,
  extra: 0,
  netRate: '',
  discType: 'No Disc',
  discVal: '',
  total: 0,
  maxPax: 0,
  maxExtraPax: 0
};

const CheckInForm = () => {
  const location = useLocation();
  const { state } = location;
  const isEditMode = state?.isEditMode || false;
  const checkinId = state?.checkinId || null;
  const preSelectedRoom = state?.preSelectedRoom || null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbar, snackbar } = useSnackbar();

  // State for dropdown options
  const [dropdowns, setDropdowns] = useState({
    arrivalModes: [],
    titles: [],
    genders: [],
    roomTypes: [],
    segments: [],
    businessSources: []
  });

  // Form state
  const [formData, setFormData] = useState(initialFormData);
  const [roomDetails, setRoomDetails] = useState([{ ...initialRoomDetail }]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Cache for rooms and plans by type
  const [cache, setCache] = useState({
    roomsByType: {},
    plansByType: {}
  });

  // Initialize room details with pre-selected room if available
  const initialRoomDetailWithPreselect = useMemo(() => {
    const detail = { ...initialRoomDetail };
    
    if (preSelectedRoom) {
      detail.roomType = preSelectedRoom.roomTypeName || '';
      detail.roomTypeId = preSelectedRoom.roomTypeId || '';
      detail.roomNo = preSelectedRoom.roomNo || '';
      detail.roomId = preSelectedRoom.roomId || '';
    }
    
    return detail;
  }, [preSelectedRoom]);

  useEffect(() => {
    setRoomDetails([initialRoomDetailWithPreselect]);
  }, [initialRoomDetailWithPreselect]);

  // Memoized fetch function for dropdowns
  const fetchDropdowns = useCallback(async () => {
    try {
      const responses = await Promise.all([
        api.get('/getArrivalModes'),
        api.get('/getAllTitleMaster'),
        api.get('/getAllGender'),
        api.get('/getAllRoomTypes'),
        api.get('/getAllSegments'),
        api.get('/getAllBusinessSources')
      ]);

      setDropdowns({
        arrivalModes: responses[0].data.success ? responses[0].data.data : [],
        titles: responses[1].data.success ? responses[1].data.data : [],
        genders: responses[2].data.success ? responses[2].data.data : [],
        roomTypes: responses[3].data.success ? responses[3].data.data : [],
        segments: responses[4].data.success ? responses[4].data.data : [],
        businessSources: responses[5].data.success ? responses[5].data.data : []
      });
    } catch (error) {
      console.error('Error fetching dropdowns:', error);
      showSnackbar('Failed to load dropdown data', { variant: 'error' });
    }
  }, [showSnackbar]);

  // Fetch check-in data if in edit mode
  const fetchCheckInData = useCallback(async () => {
    try {
      const response = await api.get(`/checkin/${checkinId}`);
      if (response.data.success) {
        const { guestInfo, roomDetails = [] } = response.data.data;
        
        // Format dates
        const formattedGuestInfo = {
          ...guestInfo,
          check_in_datetime: parseISO(guestInfo.check_in_datetime),
          check_out_datetime: parseISO(guestInfo.check_out_datetime)
        };

        setFormData(formattedGuestInfo);
        
        // Transform room details
        const transformedRoomDetails = roomDetails.map(room => ({
          roomType: '',
          roomTypeId: room.room_type_id,
          roomNo: '',
          roomId: room.room_id,
          ratePlan: '',
          ratePlanId: room.rate_plan_id,
          mealPlan: '',
          guestName: room.guest_name || '',
          contact: room.contact || '',
          male: Number(room.male) || 0,
          female: Number(room.female) || 0,
          extra: Number(room.extra) || 0,
          netRate: String(room.net_rate) || '0.00',
          discType: room.disc_type || 'No Disc',
          discVal: String(room.disc_val) || '0.00',
          total: String(room.total) || '0.00',
          maxPax: 0,
          maxExtraPax: 0
        }));

        setRoomDetails(transformedRoomDetails);
      }
    } catch (error) {
      console.error('Error fetching check-in data:', error);
      showSnackbar('Failed to load check-in data', { variant: 'error' });
    }
  }, [checkinId, showSnackbar]);

  // Memoized fetch functions for rooms and plans
  const fetchRoomsForType = useCallback(async (roomTypeId) => {
    if (!roomTypeId || cache.roomsByType[roomTypeId]) return;

    try {
      const response = await api.get(`/getRoomsByType/${roomTypeId}`);
      if (response.data.success) {
        setCache(prev => ({
          ...prev,
          roomsByType: {
            ...prev.roomsByType,
            [roomTypeId]: response.data.data
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      showSnackbar(`Failed to fetch rooms for selected type`, { variant: 'error' });
    }
  }, [cache.roomsByType, showSnackbar]);

  const fetchPlansForType = useCallback(async (roomTypeId) => {
    if (!roomTypeId || cache.plansByType[roomTypeId]) return;

    try {
      const response = await api.get(`/getRoomTypePlan/${roomTypeId}`);
      if (response.data.success) {
        setCache(prev => ({
          ...prev,
          plansByType: {
            ...prev.plansByType,
            [roomTypeId]: response.data.data
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      showSnackbar(`Failed to fetch rate plans for selected type`, { variant: 'error' });
    }
  }, [cache.plansByType, showSnackbar]);

  // Initialize component
  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true);
      
      try {
        // First load all dropdowns
        await fetchDropdowns();
        
        // If in edit mode, load the check-in data
        if (isEditMode && checkinId) {
          await fetchCheckInData();
        }
        
        // If there's a pre-selected room, load its data
        if (preSelectedRoom?.roomTypeId) {
          await Promise.all([
            fetchRoomsForType(preSelectedRoom.roomTypeId),
            fetchPlansForType(preSelectedRoom.roomTypeId)
          ]);
          
          // If room number is also pre-selected, set the room details
          if (preSelectedRoom.roomNo) {
            setRoomDetails(prev => {
              const updated = [...prev];
              const rooms = cache.roomsByType[preSelectedRoom.roomTypeId] || [];
              const selectedRoom = rooms.find(r => r.room_no === preSelectedRoom.roomNo);
              
              if (selectedRoom) {
                updated[0] = {
                  ...updated[0],
                  roomNo: preSelectedRoom.roomNo,
                  roomId: selectedRoom.id,
                  male: selectedRoom.max_pax,
                  female: 0,
                  extra: selectedRoom.max_extra_pax,
                  maxPax: selectedRoom.max_pax,
                  maxExtraPax: selectedRoom.max_extra_pax
                };
              }
              
              return updated;
            });
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
        showSnackbar('Failed to initialize form', { variant: 'error' });
      } finally {
        setIsLoading(false);
        setIsInitialLoadComplete(true);
      }
    };

    initializeForm();
  }, [
    fetchDropdowns,
    fetchCheckInData,
    fetchRoomsForType,
    fetchPlansForType,
    isEditMode,
    checkinId,
    preSelectedRoom,
    cache.roomsByType,
    showSnackbar
  ]);

  // Optimized handlers
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleDateChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleNumberOfDaysChange = useCallback((e) => {
    const days = parseInt(e.target.value) || 1;
    const newCheckOutDate = new Date(formData.check_in_datetime);
    newCheckOutDate.setDate(newCheckOutDate.getDate() + days);

    setFormData(prev => ({
      ...prev,
      number_of_days: days,
      check_out_datetime: newCheckOutDate
    }));
  }, [formData.check_in_datetime]);

  const getSelectedRoomNumbers = useCallback((currentIndex) => {
    return roomDetails
      .filter((_, index) => index !== currentIndex)
      .map(room => room.roomNo)
      .filter(Boolean);
  }, [roomDetails]);

  const addRoomRow = useCallback(() => {
    setRoomDetails(prev => [...prev, { ...initialRoomDetail }]);
  }, []);

  const removeRoomRow = useCallback((index) => {
    if (roomDetails.length <= 1) {
      showSnackbar('At least one room is required', { variant: 'warning' });
      return;
    }
    setRoomDetails(prev => prev.filter((_, i) => i !== index));
  }, [roomDetails.length, showSnackbar]);

  const handleRoomTypeChange = useCallback(async (index, value) => {
    const selectedRoomType = dropdowns.roomTypes.find(type => type.room_type_name === value);
    if (!selectedRoomType) return;

    setRoomDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...initialRoomDetail,
        roomType: value,
        roomTypeId: selectedRoomType.id
      };
      return updated;
    });

    await Promise.all([
      fetchRoomsForType(selectedRoomType.id),
      fetchPlansForType(selectedRoomType.id)
    ]);
  }, [dropdowns.roomTypes, fetchPlansForType, fetchRoomsForType]);

  const handleRoomNoChange = useCallback((index, value) => {
    const roomTypeId = roomDetails[index].roomTypeId;
    const rooms = cache.roomsByType[roomTypeId] || [];
    const selectedRoom = rooms.find(room => room.room_no === value);
    if (!selectedRoom) return;

    setRoomDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        roomNo: value,
        roomId: selectedRoom.id,
        male: selectedRoom.max_pax,
        female: 0,
        extra: selectedRoom.max_extra_pax,
        maxPax: selectedRoom.max_pax,
        maxExtraPax: selectedRoom.max_extra_pax
      };
      return updated;
    });
  }, [cache.roomsByType, roomDetails]);

  const getAvailableRoomsForRow = useCallback((index) => {
    const roomTypeId = roomDetails[index].roomTypeId;
    if (!roomTypeId) return [];

    const rooms = cache.roomsByType[roomTypeId] || [];
    const selectedRoomNumbers = getSelectedRoomNumbers(index);

    return rooms.filter(room => !selectedRoomNumbers.includes(room.room_no));
  }, [cache.roomsByType, getSelectedRoomNumbers, roomDetails]);

  const handlePaxChange = useCallback((index, field, value) => {
    const numValue = parseInt(value) || 0;

    setRoomDetails(prev => {
      const updated = [...prev];
      const room = updated[index];

      // Validate against max values
      if (field === 'male' || field === 'female') {
        const totalAdults = field === 'male'
          ? numValue + room.female
          : room.male + numValue;

        if (totalAdults > room.maxPax) {
          setAlertMessage(`Total adults (${totalAdults}) exceeds maximum pax (${room.maxPax}) for this room.`);
          setOpenAlert(true);
          return prev;
        }
      } else if (field === 'extra' && numValue > room.maxExtraPax) {
        setAlertMessage(`Extra pax (${numValue}) exceeds maximum extra pax (${room.maxExtraPax}) for this room.`);
        setOpenAlert(true);
        return prev;
      }

      updated[index] = {
        ...room,
        [field]: numValue
      };
      return updated;
    });
  }, []);

  const handleRatePlanChange = useCallback((index, value) => {
    const roomTypeId = roomDetails[index].roomTypeId;
    const plans = cache.plansByType[roomTypeId] || [];
    const selectedPlan = plans.find(plan => plan.plan_name === value);
    if (!selectedPlan) return;

    // Generate meal plan based on complimentary services
    const services = [];
    if (selectedPlan.complimentary_breakfast) services.push('BR');
    if (selectedPlan.complimentary_lunch) services.push('L');
    if (selectedPlan.complimentary_dinner) services.push('D');
    if (selectedPlan.complimentary_wifi) services.push('WIFI');
    const mealPlan = services.join(', ');

    setRoomDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        ratePlan: value,
        ratePlanId: selectedPlan.id,
        mealPlan,
        netRate: selectedPlan.rate_per_day,
        total: selectedPlan.rate_per_day,
        discType: 'No Disc',
        discVal: ''
      };
      return updated;
    });
  }, [cache.plansByType, roomDetails]);

  const handleDiscTypeChange = useCallback((index, value) => {
    setRoomDetails(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        discType: value,
        discVal: '',
        total: updated[index].netRate
      };
      return updated;
    });
  }, []);

  const handleDiscValChange = useCallback((index, value) => {
    setRoomDetails(prev => {
      const updated = [...prev];
      const room = updated[index];
      const netRate = parseFloat(room.netRate) || 0;
      let total = netRate;

      if (room.discType === 'Amount') {
        const discountAmount = parseFloat(value) || 0;
        total = Math.max(0, netRate - discountAmount);
      } else if (room.discType === 'Percentage') {
        const discountPercentage = parseFloat(value) || 0;
        // Calculate the discount amount by applying percentage to net rate
        const discountAmount = (netRate * discountPercentage) / 100;
        // Subtract the discount amount from the net rate
        total = Math.max(0, netRate - discountAmount);
      }

      updated[index] = {
        ...room,
        discVal: value,
        total: total.toFixed(2)
      };
      return updated;
    });
  }, []);

  const handleFileUpload = useCallback((type, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        [type]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.contact) {
      setAlertMessage('Contact number is required');
      return false;
    }

    if (!formData.title) {
      setAlertMessage('Title is required');
      return false;
    }

    if (!formData.first_name) {
      setAlertMessage('First name is required');
      return false;
    }

    for (let i = 0; i < roomDetails.length; i++) {
      const room = roomDetails[i];

      if (!room.roomType) {
        setAlertMessage(`Room ${i + 1}: Room type is required`);
        return false;
      }

      if (!room.roomNo) {
        setAlertMessage(`Room ${i + 1}: Room number is required`);
        return false;
      }

      if (!room.ratePlan) {
        setAlertMessage(`Room ${i + 1}: Rate plan is required`);
        return false;
      }

      if (!room.guestName) {
        setAlertMessage(`Room ${i + 1}: Guest name is required`);
        return false;
      }

      const totalAdults = room.male + room.female;
      if (totalAdults > room.maxPax) {
        setAlertMessage(`Room ${i + 1}: Total adults (${totalAdults}) exceeds maximum pax (${room.maxPax}).`);
        return false;
      }

      if (room.extra > room.maxExtraPax) {
        setAlertMessage(`Room ${i + 1}: Extra pax (${room.extra}) exceeds maximum extra pax (${room.maxExtraPax}).`);
        return false;
      }
    }

    return true;
  }, [formData, roomDetails]);

  const prepareSubmitData = useCallback(() => ({
    guestInfo: {
      ...formData,
      check_in_datetime: format(formData.check_in_datetime, "yyyy-MM-dd'T'HH:mm:ss"),
      check_out_datetime: format(formData.check_out_datetime, "yyyy-MM-dd'T'HH:mm:ss")
    },
    roomDetails: roomDetails.map(room => ({
      roomTypeId: room.roomTypeId,
      roomId: room.roomId,
      ratePlanId: room.ratePlanId,
      guestName: room.guestName,
      contact: room.contact,
      male: room.male,
      female: room.female,
      extra: room.extra,
      netRate: room.netRate,
      discType: room.discType,
      discVal: room.discVal,
      total: room.total
    }))
  }), [formData, roomDetails]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setOpenAlert(true);
        return;
      }

      const submitData = prepareSubmitData();
      
      let response;
      if (isEditMode) {
        response = await api.put(`/editcheckin/${checkinId}`, submitData);
      } else {
        response = await api.post('/checkinConfirm', submitData);
      }

      if (response.data.success) {
        showSnackbar(
          isEditMode ? 'Check-in updated successfully!' : 'Check-in created successfully!', 
          { variant: 'success' }
        );
        
        if (!isEditMode) {
          setFormData(initialFormData);
          setRoomDetails([{ ...initialRoomDetail }]);
        }
      } else {
        showSnackbar(response.data.message || 'Operation failed', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showSnackbar('An error occurred while submitting the form', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }, [prepareSubmitData, showSnackbar, validateForm, isEditMode, checkinId]);

  if (isLoading || !isInitialLoadComplete) {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <UILoader />
    </Box>
  );
}

  return (
    <Paper sx={{
      width: '100%',
      p: isMobile ? 2 : 3,
      bgcolor: '#f5f5f5',
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>

      {/* The rest of your existing form content */}
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#2e7d32' }}>
        Quick Check-In
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        {/* Guest Information Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          {/* First Row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={formData.is_reservation}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_reservation: e.target.checked }))}
                  />
                }
                label="Is Reservation"
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <TextField
                label="Reservation Number"
                fullWidth
                size="small"
                variant="outlined"
                disabled={!formData.is_reservation}
                value={formData.reservation_number}
                onChange={(e) => setFormData(prev => ({ ...prev, reservation_number: e.target.value }))}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="arrival-mode-label">Arrival Mode *</InputLabel>
                <Select
                  labelId="arrival-mode-label"
                  value={formData.arrival_mode}
                  onChange={(e) => setFormData(prev => ({ ...prev, arrival_mode: e.target.value }))}
                  label="Arrival Mode"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {dropdowns.arrivalModes.map((mode) => (
                    <MenuItem key={mode.id} value={mode.id}>{mode.mode_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <TextField
                label="OTA"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.ota}
                onChange={(e) => setFormData(prev => ({ ...prev, ota: e.target.value }))}
              />
            </Box>
          </Box>

          {/* Second Row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <TextField
                label="Booking ID"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.booking_id}
                onChange={(e) => setFormData(prev => ({ ...prev, booking_id: e.target.value }))}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <TextField
                label="Contact No. *"
                fullWidth
                size="small"
                variant="outlined"
                required
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="title-label">Title *</InputLabel>
                <Select
                  labelId="title-label"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  label="Title"
                  required
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {dropdowns.titles.map((title) => (
                    <MenuItem key={title.id} value={title.id}>{title.title_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <TextField
                label="First Name *"
                fullWidth
                size="small"
                variant="outlined"
                required
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </Box>
          </Box>

          {/* Third Row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <TextField
                label="Last Name"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  label="Gender"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {dropdowns.genders.map((gender) => (
                    <MenuItem key={gender.id} value={gender.id}>{gender.gender_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <TextField
                label="City"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <TextField
                label="ID No. (Aadhaar, Other)"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.id_number}
                onChange={(e) => setFormData(prev => ({ ...prev, id_number: e.target.value }))}
              />
            </Box>
          </Box>

          {/* Fourth Row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <TextField
                label="Email"
                fullWidth
                size="small"
                variant="outlined"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="checkin-mode-label">Check-In Mode</InputLabel>
                <Select
                  labelId="checkin-mode-label"
                  value={formData.check_in_mode}
                  onChange={(e) => setFormData(prev => ({ ...prev, check_in_mode: e.target.value }))}
                  label="Check-In Mode"
                >
                  <MenuItem value="Day">Day</MenuItem>
                  <MenuItem value="Night">Night</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="allow-credit-label">Allow Credit</InputLabel>
                <Select
                  labelId="allow-credit-label"
                  value={formData.allow_credit}
                  onChange={(e) => setFormData(prev => ({ ...prev, allow_credit: e.target.value }))}
                  label="Allow Credit"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="foreign-guest-label">Foreign Guest</InputLabel>
                <Select
                  labelId="foreign-guest-label"
                  value={formData.foreign_guest}
                  onChange={(e) => setFormData(prev => ({ ...prev, foreign_guest: e.target.value }))}
                  label="Foreign Guest"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Fifth Row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="segment-label">Segment Name</InputLabel>
                <Select
                  labelId="segment-label"
                  value={formData.segment_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, segment_id: e.target.value }))}
                  label="Segment Name"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {dropdowns.segments.map(segment => (
                    <MenuItem key={segment.id} value={segment.id}>{segment.segment_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="business-source-label">Business Source</InputLabel>
                <Select
                  labelId="business-source-label"
                  value={formData.business_source_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_source_id: e.target.value }))}
                  label="Business Source"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {dropdowns.businessSources.map(source => (
                    <MenuItem key={source.id} value={source.id}>{source.source_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <Box display="flex" alignItems="center" gap={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  onChange={(e) => handleFileUpload('photo', e.target.files[0])}
                />
                <label htmlFor="photo-upload">
                  <IconButton color="primary" component="span" size="small">
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </label>
                <Typography variant="body2">Upload Photo</Typography>
                <Avatar
                  variant="square"
                  sx={{ width: 40, height: 40, bgcolor: 'grey.200' }}
                  src={formData.photo}
                />
              </Box>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
              <Box display="flex" alignItems="center" gap={2}>
                <input
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  style={{ display: 'none' }}
                  id="document-upload"
                  type="file"
                  onChange={(e) => handleFileUpload('document', e.target.files[0])}
                />
                <label htmlFor="document-upload">
                  <IconButton color="primary" component="span" size="small">
                    <InsertDriveFile fontSize="small" />
                  </IconButton>
                </label>
                <Typography variant="body2">Upload Document</Typography>
                <Avatar
                  variant="square"
                  sx={{ width: 40, height: 40, bgcolor: 'grey.200' }}
                  src={formData.document}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Room Details Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">Room Details</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={addRoomRow}
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                bgcolor: '#1b5e20'
              }
            }}
          >
            Add Room
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 3, maxWidth: '100%', overflowX: 'auto' }}>
          <Table size="small" sx={{ '& .MuiTableCell-root': { fontSize: '0.75rem', py: 0.5, px: 1 } }}>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ minWidth: '120px' }}>Room Type *</TableCell>
                <TableCell sx={{ minWidth: '80px' }}>Room No. *</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>Rate Plan *</TableCell>
                <TableCell sx={{ minWidth: '80px' }}>Meal Plan</TableCell>
                <TableCell sx={{ minWidth: '120px' }}>Guest Name *</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>Contact</TableCell>
                <TableCell sx={{ minWidth: '60px' }}>Male</TableCell>
                <TableCell sx={{ minWidth: '60px' }}>Female</TableCell>
                <TableCell sx={{ minWidth: '60px' }}>Extra</TableCell>
                <TableCell sx={{ minWidth: '80px' }}>Net Rate</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>Disc. Type</TableCell>
                <TableCell sx={{ minWidth: '80px' }}>Disc. Val</TableCell>
                <TableCell sx={{ minWidth: '80px' }}>Total</TableCell>
                <TableCell sx={{ minWidth: '40px' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomDetails.map((row, index) => (
                <TableRow key={index}>
                  {/* Room Type */}
                  <TableCell>
                    <FormControl fullWidth size="small" sx={{ minWidth: '120px', '& .MuiInputBase-root': { fontSize: '0.75rem', py: 0.5 } }}>
                      <Select
                        value={row.roomType}
                        onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                        displayEmpty
                        required
                      >
                        <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                          <em>Select Room Type</em>
                        </MenuItem>
                        {dropdowns.roomTypes.map((type) => (
                          <MenuItem key={type.id} value={type.room_type_name} sx={{ fontSize: '0.75rem' }}>
                            {type.room_type_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* Room No */}
                  <TableCell>
                    <FormControl fullWidth size="small" sx={{ minWidth: '80px', '& .MuiInputBase-root': { fontSize: '0.75rem', py: 0.5 } }}>
                      <Select
                        value={row.roomNo}
                        onChange={(e) => handleRoomNoChange(index, e.target.value)}
                        displayEmpty
                        required
                        disabled={!row.roomTypeId}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                          <em>Select Room</em>
                        </MenuItem>
                        {getAvailableRoomsForRow(index).map((room) => (
                          <MenuItem key={room.id} value={room.room_no} sx={{ fontSize: '0.75rem' }}>
                            {room.room_no}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* Rate Plan */}
                  <TableCell>
                    <FormControl fullWidth size="small" sx={{ minWidth: '100px', '& .MuiInputBase-root': { fontSize: '0.75rem', py: 0.5 } }}>
                      <Select
                        value={row.ratePlan}
                        onChange={(e) => handleRatePlanChange(index, e.target.value)}
                        displayEmpty
                        required
                        disabled={!row.roomTypeId}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                          <em>Select Plan</em>
                        </MenuItem>
                        {row.roomTypeId && cache.plansByType[row.roomTypeId]?.map((plan) => (
                          <MenuItem key={plan.id} value={plan.plan_name} sx={{ fontSize: '0.75rem' }}>
                            {plan.plan_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* Meal Plan */}
                  <TableCell>
                    <TextField
                      value={row.mealPlan}
                      size="small"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        sx: { fontSize: '0.75rem', py: 0.5 }
                      }}
                      sx={{ '& .MuiInputBase-root': { minWidth: '80px' } }}
                    />
                  </TableCell>

                  {/* Guest Name */}
                  <TableCell>
                    <TextField
                      value={row.guestName}
                      onChange={(e) => {
                        const updated = [...roomDetails];
                        updated[index].guestName = e.target.value;
                        setRoomDetails(updated);
                      }}
                      size="small"
                      fullWidth
                      InputProps={{ sx: { fontSize: '0.75rem', py: 0.5 } }}
                      sx={{ '& .MuiInputBase-root': { minWidth: '120px' } }}
                    />
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <TextField
                      value={row.contact}
                      onChange={(e) => {
                        const updated = [...roomDetails];
                        updated[index].contact = e.target.value;
                        setRoomDetails(updated);
                      }}
                      size="small"
                      fullWidth
                      InputProps={{ sx: { fontSize: '0.75rem', py: 0.5 } }}
                      sx={{ '& .MuiInputBase-root': { minWidth: '100px' } }}
                    />
                  </TableCell>

                  {/* Male */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.male}
                      onChange={(e) => handlePaxChange(index, 'male', e.target.value)}
                      size="small"
                      inputProps={{ min: 0, max: row.maxPax }}
                      fullWidth
                      InputProps={{ sx: { fontSize: '0.75rem', py: 0.5 } }}
                      sx={{ '& .MuiInputBase-root': { minWidth: '60px' } }}
                    />
                  </TableCell>

                  {/* Female */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.female}
                      onChange={(e) => handlePaxChange(index, 'female', e.target.value)}
                      size="small"
                      inputProps={{ min: 0, max: row.maxPax }}
                      fullWidth
                      InputProps={{ sx: { fontSize: '0.75rem', py: 0.5 } }}
                      sx={{ '& .MuiInputBase-root': { minWidth: '60px' } }}
                    />
                  </TableCell>

                  {/* Extra */}
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.extra}
                      onChange={(e) => handlePaxChange(index, 'extra', e.target.value)}
                      size="small"
                      inputProps={{ min: 0, max: row.maxExtraPax }}
                      fullWidth
                      InputProps={{ sx: { fontSize: '0.75rem', py: 0.5 } }}
                      sx={{ '& .MuiInputBase-root': { minWidth: '60px' } }}
                    />
                  </TableCell>

                  {/* Net Rate */}
                  <TableCell>
                    <TextField
                      value={row.netRate}
                      size="small"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        sx: { fontSize: '0.75rem', py: 0.5 }
                      }}
                      sx={{ '& .MuiInputBase-root': { minWidth: '80px' } }}
                    />
                  </TableCell>

                  {/* Disc. Type */}
                  <TableCell>
                    <FormControl fullWidth size="small" sx={{ minWidth: '100px', '& .MuiInputBase-root': { fontSize: '0.75rem', py: 0.5 } }}>
                      <Select
                        value={row.discType}
                        onChange={(e) => handleDiscTypeChange(index, e.target.value)}
                        disabled={!row.netRate}
                      >
                        <MenuItem value="No Disc" sx={{ fontSize: '0.75rem' }}>No Disc</MenuItem>
                        <MenuItem value="Amount" sx={{ fontSize: '0.75rem' }}>Amount</MenuItem>
                        <MenuItem value="Percentage" sx={{ fontSize: '0.75rem' }}>Percentage</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* Disc. Val */}
                  <TableCell>
                    <TextField
                      value={row.discVal}
                      onChange={(e) => handleDiscValChange(index, e.target.value)}
                      size="small"
                      fullWidth
                      disabled={row.discType === 'No Disc' || !row.netRate}
                      InputProps={{
                        sx: { fontSize: '0.75rem', py: 0.5 },
                        endAdornment: row.discType === 'Percentage' ? '%' : null
                      }}
                      sx={{ '& .MuiInputBase-root': { minWidth: '80px' } }}
                    />
                  </TableCell>

                  {/* Total */}
                  <TableCell>
                    <TextField
                      value={row.total}
                      size="small"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        sx: { fontSize: '0.75rem', py: 0.5 }
                      }}
                      sx={{ '& .MuiInputBase-root': { minWidth: '80px' } }}
                    />
                  </TableCell>

                  {/* Delete Action */}
                  <TableCell>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeRoomRow(index)}
                      disabled={roomDetails.length <= 1}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 3 }} />

        {/* Check-in Details Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Check-in Details
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
              <Box sx={{ flex: '1 1 200px' }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="checkin-type-label">Check-in Type</InputLabel>
                  <Select
                    labelId="checkin-type-label"
                    value={formData.check_in_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, check_in_type: e.target.value }))}
                    label="Check-in Type"
                  >
                    <MenuItem value="24 Hours CheckIn">24 Hours CheckIn</MenuItem>
                    <MenuItem value="Day Use">Day Use</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: '1 1 200px' }}>
                <DateTimePicker
                  label="Check-in Date & Time"
                  value={formData.check_in_datetime}
                  onChange={(newValue) => handleDateChange('check_in_datetime', newValue)}
                  format="dd-MM-yyyy HH:mm"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                />
              </Box>

              <Box sx={{ flex: '1 1 150px' }}>
                <TextField
                  label="No.of Days"
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="number"
                  value={formData.number_of_days}
                  onChange={handleNumberOfDaysChange}
                />
              </Box>

              <Box sx={{ flex: '1 1 200px' }}>
                <DateTimePicker
                  label="Check-out Date & Time"
                  value={formData.check_out_datetime}
                  onChange={(newValue) => handleDateChange('check_out_datetime', newValue)}
                  format="dd-MM-yyyy HH:mm"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 200px' }}>
                <TextField
                  label="Check-out Grace Time (hours)"
                  type="number"
                  value={formData.grace_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, grace_hours: Number(e.target.value) }))}
                  inputProps={{ min: 0, max: 24, step: 1 }}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                  }}
                />
              </Box>

              <Box sx={{ flex: '1 1 200px' }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="payment-by-label">Payment By</InputLabel>
                  <Select
                    labelId="payment-by-label"
                    value={formData.payment_by}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_by: e.target.value }))}
                    label="Payment By"
                  >
                    <MenuItem value="Direct">Direct</MenuItem>
                    <MenuItem value="Company">Company</MenuItem>
                    <MenuItem value="OTA">OTA</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={formData.allow_charges_posting}
                      onChange={(e) => setFormData(prev => ({ ...prev, allow_charges_posting: e.target.checked }))}
                    />
                  }
                  label="Allow Charges Posting"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={formData.enable_paxwise}
                      onChange={(e) => setFormData(prev => ({ ...prev, enable_paxwise: e.target.checked }))}
                    />
                  }
                  label="Enable Paxwise"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={formData.enable_room_sharing}
                      onChange={(e) => setFormData(prev => ({ ...prev, enable_room_sharing: e.target.checked }))}
                    />
                  }
                  label="Enable Room Sharing"
                />
              </Box>
            </Box>
          </LocalizationProvider>
        </Box>

        {/* Address Details Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Address Details
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                label="GST Number"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.gst_number}
                onChange={(e) => setFormData(prev => ({ ...prev, gst_number: e.target.value }))}
              />
            </Box>

            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                label="Guest Company"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.guest_company}
                onChange={(e) => setFormData(prev => ({ ...prev, guest_company: e.target.value }))}
              />
            </Box>

            <Box sx={{ flex: '1 1 150px' }}>
              <TextField
                label="Age"
                fullWidth
                size="small"
                variant="outlined"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <FormControl fullWidth size="small">
                <InputLabel id="gst-type-label">GST Type</InputLabel>
                <Select
                  labelId="gst-type-label"
                  value={formData.gst_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, gst_type: e.target.value }))}
                  label="GST Type"
                >
                  <MenuItem value="UNREGISTERED">UNREGISTERED</MenuItem>
                  <MenuItem value="REGISTERED">REGISTERED</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                label="Address"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="Visit Remark"
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={2}
                value={formData.visit_remark}
                onChange={(e) => setFormData(prev => ({ ...prev, visit_remark: e.target.value }))}
              />
            </Box>

            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                label="City"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </Box>

            <Box sx={{ flex: '1 1 150px' }}>
              <TextField
                label="Pin Code"
                fullWidth
                size="small"
                variant="outlined"
                type="number"
                value={formData.pin_code}
                onChange={(e) => setFormData(prev => ({ ...prev, pin_code: e.target.value }))}
              />
            </Box>

            <Box sx={{ flex: '1 1 200px' }}>
              <FormControl fullWidth size="small">
                <InputLabel id="nationality-label">Nationality</InputLabel>
                <Select
                  labelId="nationality-label"
                  value={formData.nationality}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                  label="Nationality"
                >
                  <MenuItem value="Indian">Indian</MenuItem>
                  <MenuItem value="Foreign">Foreign</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                label="Booking Instructions"
                fullWidth
                size="small"
                variant="outlined"
                value={formData.booking_instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, booking_instructions: e.target.value }))}
              />
            </Box>

            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                label="Guest Special Instructions"
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={2}
                value={formData.guest_special_instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, guest_special_instructions: e.target.value }))}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={formData.is_vip}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_vip: e.target.checked }))}
                />
              }
              label="Is VIP"
            />
          </Box>
        </Box>

        {/* Submit Button */}
        <Box display="flex" justifyContent="flex-end" mt={2} width="100%">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              px: 4,
              py: 1,
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 1,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                bgcolor: '#1b5e20'
              }
            }}
          >
            {isSubmitting ? 'Processing...' : isEditMode ? 'Update Check-In' : 'Create Check-In'}
          </Button>
        </Box>
      </Box>

      {/* Alert Dialog */}
      <Dialog
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Capacity Exceeded</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAlert(false)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar}
    </Paper>
  );
};

export default React.memo(CheckInForm);