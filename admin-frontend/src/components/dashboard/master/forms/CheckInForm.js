import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { 
  Paper, 
  Button, 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle,  
  Divider, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  useTheme,
  useMediaQuery,
  Snackbar,
  Fade,
  Slide,
  Grow
} from '@mui/material';
import api from '../../../../utils/axios';
import { format, parseISO } from 'date-fns';
import MuiAlert from '@mui/material/Alert';
import UILoader from '../../../common/UILoader';
import GuestInfoForm from './GuestInfoForm';
import RoomDetailsForm from './RoomDetailsForm';

// Enhanced Alert component with animations
const Alert = React.forwardRef(function Alert(props, ref) {
  return (
    <Grow in={true} timeout={300}>
      <MuiAlert 
        elevation={6} 
        ref={ref} 
        variant="filled" 
        {...props} 
        sx={{
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          '& .MuiAlert-icon': {
            fontSize: '1.5rem'
          },
          '&.MuiAlert-filledSuccess': {
            backgroundColor: '#4caf50', // Custom green color
          }
        }}
      />
    </Grow>
  );
});

const MemoizedAlert = React.memo(Alert);

// Optimized custom hook for Snackbar with transitions
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
      severity: options.variant || 'info',
      key: new Date().getTime() // Add key to force re-render for consecutive messages
    });
  }, []);

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState(prev => ({ ...prev, open: false }));
  }, []);

  return {
    showSnackbar,
    snackbar: (
      <Snackbar 
        open={snackbarState.open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        key={snackbarState.key}
      >
        <MemoizedAlert 
          onClose={handleClose} 
          severity={snackbarState.severity} 
          sx={{ 
            width: '100%',
            minWidth: '300px',
            '& .MuiAlert-message': {
              fontSize: '0.95rem'
            }
          }}
        >
          {snackbarState.message}
        </MemoizedAlert>
      </Snackbar>
    )
  };
};

// Initial data structures
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

// Styled components for better UI
const FormContainer = styled(Paper)(({ theme }) => ({
  width: '95%',
  maxWidth: '1400px',
  margin: '2rem auto',
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    width: '100%',
    margin: '1rem auto',
    borderRadius: '8px'
  }
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  fontSize: '1.75rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem'
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  fontSize: '1rem',
  borderRadius: '8px',
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(1.5, 2)
  }
}));

const CheckInForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const isEditMode = state?.isEditMode || false;
  const checkinId = state?.checkinId || null;
  const preSelectedRoom = state?.preSelectedRoom || null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbar, snackbar } = useSnackbar();

  const [dropdowns, setDropdowns] = useState({
    arrivalModes: [],
    titles: [],
    genders: [],
    roomTypes: [],
    segments: [],
    businessSources: []
  });

  const [formData, setFormData] = useState(initialFormData);
  const [roomDetails, setRoomDetails] = useState([{ ...initialRoomDetail }]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [cache, setCache] = useState({
    roomsByType: {},
    plansByType: {}
  });

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

  const fetchCheckInData = useCallback(async () => {
    try {
      const response = await api.get(`/checkin/${checkinId}`);
      if (response.data.success) {
        const { guestInfo, roomDetails = [] } = response.data.data;
        
        const formattedGuestInfo = {
          ...guestInfo,
          check_in_datetime: parseISO(guestInfo.check_in_datetime),
          check_out_datetime: parseISO(guestInfo.check_out_datetime)
        };

        setFormData(formattedGuestInfo);
        
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

  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true);
      
      try {
        await fetchDropdowns();
        
        if (isEditMode && checkinId) {
          await fetchCheckInData();
        }
        
        if (preSelectedRoom?.roomTypeId) {
          await Promise.all([
            fetchRoomsForType(preSelectedRoom.roomTypeId),
            fetchPlansForType(preSelectedRoom.roomTypeId)
          ]);
          
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

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleDateChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
        const discountAmount = (netRate * discountPercentage) / 100;
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
        
        // Navigate after a short delay to allow the snackbar to be seen
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        
        if (!isEditMode) {
          setFormData(initialFormData);
          setRoomDetails([{ ...initialRoomDetail }]);
        }
      } else {
        showSnackbar(response.data.message || 'Operation failed', { variant: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showSnackbar('An error occurred while submitting the form', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }, [prepareSubmitData, showSnackbar, validateForm, isEditMode, checkinId, navigate]);

  if (isLoading || !isInitialLoadComplete) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh'
      }}>
        <UILoader size={80} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <FormContainer>
        <FormTitle variant="h6">
          {isEditMode ? 'Edit Check-In' : 'Quick Check-In'}
        </FormTitle>

        <Divider sx={{ 
          mb: 4,
          borderColor: 'divider',
          borderBottomWidth: '2px'
        }} />

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}
        >
          <RoomDetailsForm
            roomDetails={roomDetails}
            dropdowns={dropdowns}
            isMobile={isMobile}
            cache={cache}
            onRoomTypeChange={handleRoomTypeChange}
            onRoomNoChange={handleRoomNoChange}
            onRatePlanChange={handleRatePlanChange}
            onPaxChange={handlePaxChange}
            onDiscTypeChange={handleDiscTypeChange}
            onDiscValChange={handleDiscValChange}
            onAddRoom={addRoomRow}
            onRemoveRoom={removeRoomRow}
            onRoomFieldChange={(index, field, value) => {
              const updated = [...roomDetails];
              updated[index][field] = value;
              setRoomDetails(updated);
            }}
          />

          <GuestInfoForm
            formData={formData}
            dropdowns={dropdowns}
            onInputChange={handleInputChange}
            onDateChange={handleDateChange}
            onFileUpload={handleFileUpload}
            onNumberOfDaysChange={handleNumberOfDaysChange}
          />

          <Box 
            display="flex" 
            justifyContent="flex-end" 
            mt={4}
            sx={{
              position: 'sticky',
              bottom: '1rem',
              zIndex: 10,
              backgroundColor: 'background.paper',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              size="large"
            >
              {isSubmitting ? 'Processing...' : isEditMode ? 'Update Check-In' : 'Create Check-In'}
            </SubmitButton>
          </Box>
        </Box>

        <Dialog
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          TransitionComponent={Slide}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              padding: '1rem',
              minWidth: isMobile ? '90%' : '400px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
            Validation Error
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '1rem' }}>
              {alertMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenAlert(false)} 
              color="primary" 
              variant="contained"
              sx={{
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {snackbar}
      </FormContainer>
    </Fade>
  );
};

export default React.memo(CheckInForm);