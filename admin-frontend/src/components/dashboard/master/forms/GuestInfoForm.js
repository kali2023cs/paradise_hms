import React, { useCallback, useMemo, useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Avatar,
  Box,
  Divider,
  Typography,
  Paper,
  InputAdornment,
  styled,
  Collapse,
  Button
} from '@mui/material';
import { PhotoCamera, InsertDriveFile, Star, ExpandMore, ExpandLess } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Styled components
const StyledSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[3]
  }
}));

const StyledSectionHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer'
}));

const StyledFormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const StyledFormField = styled(Box)(({ theme }) => ({
  flex: '1 1 200px',
  minWidth: '200px'
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.grey[200],
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)'
  }
}));

const StyledCheckboxGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1)
  }
}));

const VIPCheckbox = styled(FormControlLabel)(({ theme, checked }) => ({
  '& .MuiTypography-root': {
    fontWeight: checked ? 'bold' : 'normal',
    color: checked ? theme.palette.warning.main : 'inherit'
  },
  '& .MuiCheckbox-root': {
    color: checked ? theme.palette.warning.main : undefined
  }
}));

const GuestInfoForm = React.memo(({
  formData,
  dropdowns,
  isMobile,
  onInputChange,
  onDateChange,
  onFileUpload,
  onNumberOfDaysChange
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    checkInDetails: true,
    addressInfo: true
  });

  // Unified change handler
  const handleChange = useCallback((field, value) => {
    onInputChange(field, value);
  }, [onInputChange]);

  // Special handler for select components
  const handleSelectChange = useCallback((field) => (event) => {
    handleChange(field, event.target.value);
  }, [handleChange]);

  // Handler for checkbox components
  const handleCheckboxChange = useCallback((field) => (event) => {
    handleChange(field, event.target.checked);
  }, [handleChange]);

  // Text field change handler
  const handleTextFieldChange = useCallback((field) => (event) => {
    handleChange(field, event.target.value);
  }, [handleChange]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const memoizedDropdowns = useMemo(() => ({
    arrivalModes: dropdowns.arrivalModes || [],
    titles: dropdowns.titles || [],
    genders: dropdowns.genders || [],
    segments: dropdowns.segments || [],
    businessSources: dropdowns.businessSources || []
  }), [dropdowns]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Basic Information Section */}
      <Paper elevation={2}>
        <StyledSectionHeader 
          variant="h6" 
          onClick={() => toggleSection('basicInfo')}
        >
          Basic Information
          {expandedSections.basicInfo ? <ExpandLess /> : <ExpandMore />}
        </StyledSectionHeader>
        
        <Collapse in={expandedSections.basicInfo}>
          <StyledSection>
            <StyledFormRow>
              <StyledFormField>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_reservation}
                      onChange={handleCheckboxChange('is_reservation')}
                      color="primary"
                    />
                  }
                  label="Is Reservation"
                />
              </StyledFormField>
              
              <StyledFormField>
                <TextField
                  label="Reservation Number"
                  value={formData.reservation_number}
                  onChange={handleTextFieldChange('reservation_number')}
                  fullWidth
                  size="small"
                  variant="outlined"
                  disabled={!formData.is_reservation}
                />
              </StyledFormField>
              
              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>Arrival Mode *</InputLabel>
                  <Select
                    value={formData.arrival_mode}
                    onChange={handleSelectChange('arrival_mode')}
                    label="Arrival Mode"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {memoizedDropdowns.arrivalModes.map((mode) => (
                      <MenuItem key={mode.id} value={mode.id}>{mode.mode_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </StyledFormField>
              
              <StyledFormField>
                <TextField
                  label="OTA"
                  value={formData.ota}
                  onChange={handleTextFieldChange('ota')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>
            </StyledFormRow>

            <StyledFormRow>
              <StyledFormField>
                <TextField
                  label="Booking ID"
                  value={formData.booking_id}
                  onChange={handleTextFieldChange('booking_id')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>
              
              <StyledFormField>
                <TextField
                  label="Contact No. *"
                  value={formData.contact}
                  onChange={handleTextFieldChange('contact')}
                  fullWidth
                  size="small"
                  variant="outlined"
                  required
                />
              </StyledFormField>
              
              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>Title *</InputLabel>
                  <Select
                    value={formData.title}
                    onChange={handleSelectChange('title')}
                    label="Title"
                    required
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {memoizedDropdowns.titles.map((title) => (
                      <MenuItem key={title.id} value={title.id}>{title.title_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </StyledFormField>
              
              <StyledFormField>
                <TextField
                  label="First Name *"
                  value={formData.first_name}
                  onChange={handleTextFieldChange('first_name')}
                  fullWidth
                  size="small"
                  variant="outlined"
                  required
                />
              </StyledFormField>
            </StyledFormRow>

            <StyledFormRow>
              <StyledFormField>
                <TextField
                  label="Last Name"
                  value={formData.last_name}
                  onChange={handleTextFieldChange('last_name')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>
              
              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={handleSelectChange('gender')}
                    label="Gender"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {memoizedDropdowns.genders.map((gender) => (
                      <MenuItem key={gender.id} value={gender.id}>{gender.gender_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </StyledFormField>
              
              <StyledFormField>
                <TextField
                  label="City"
                  value={formData.city}
                  onChange={handleTextFieldChange('city')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>
              
              <StyledFormField>
                <TextField
                  label="ID No. (Aadhaar, Other)"
                  value={formData.id_number}
                  onChange={handleTextFieldChange('id_number')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>
            </StyledFormRow>

            <StyledFormRow>
              <StyledFormField>
                <TextField
                  label="Email"
                  value={formData.email}
                  onChange={handleTextFieldChange('email')}
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="email"
                />
              </StyledFormField>
              
              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>Check-In Mode</InputLabel>
                  <Select
                    value={formData.check_in_mode}
                    onChange={handleSelectChange('check_in_mode')}
                    label="Check-In Mode"
                  >
                    <MenuItem value="Day">Day</MenuItem>
                    <MenuItem value="Night">Night</MenuItem>
                  </Select>
                </FormControl>
              </StyledFormField>
              
              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>Allow Credit</InputLabel>
                  <Select
                    value={formData.allow_credit}
                    onChange={handleSelectChange('allow_credit')}
                    label="Allow Credit"
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </StyledFormField>
              
              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>Foreign Guest</InputLabel>
                  <Select
                    value={formData.foreign_guest}
                    onChange={handleSelectChange('foreign_guest')}
                    label="Foreign Guest"
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </StyledFormField>
            </StyledFormRow>

            <StyledFormRow>
              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>Segment Name</InputLabel>
                  <Select
                    value={formData.segment_id}
                    onChange={handleSelectChange('segment_id')}
                    label="Segment Name"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {memoizedDropdowns.segments.map(segment => (
                      <MenuItem key={segment.id} value={segment.id}>{segment.segment_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </StyledFormField>
              
              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>Business Source</InputLabel>
                  <Select
                    value={formData.business_source_id}
                    onChange={handleSelectChange('business_source_id')}
                    label="Business Source"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {memoizedDropdowns.businessSources.map(source => (
                      <MenuItem key={source.id} value={source.id}>{source.source_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </StyledFormField>
              
              <StyledFormField>
                <Box display="flex" alignItems="center" gap={2}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={(e) => onFileUpload('photo', e.target.files[0])}
                  />
                  <label htmlFor="photo-upload">
                    <IconButton color="primary" component="span" size="small">
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  </label>
                  <Typography variant="body2">Upload Photo</Typography>
                  <StyledAvatar variant="square" src={formData.photo} />
                </Box>
              </StyledFormField>
              
              <StyledFormField>
                <Box display="flex" alignItems="center" gap={2}>
                  <input
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    style={{ display: 'none' }}
                    id="document-upload"
                    type="file"
                    onChange={(e) => onFileUpload('document', e.target.files[0])}
                  />
                  <label htmlFor="document-upload">
                    <IconButton color="primary" component="span" size="small">
                      <InsertDriveFile fontSize="small" />
                    </IconButton>
                  </label>
                  <Typography variant="body2">Upload Document</Typography>
                  <StyledAvatar variant="square" src={formData.document} />
                </Box>
              </StyledFormField>
            </StyledFormRow>
          </StyledSection>
        </Collapse>
      </Paper>

      {/* Check-in Details Section */}
      <Paper elevation={2}>
        <StyledSectionHeader 
          variant="h6" 
          onClick={() => toggleSection('checkInDetails')}
        >
          Check-in Details
          {expandedSections.checkInDetails ? <ExpandLess /> : <ExpandMore />}
        </StyledSectionHeader>
        
        <Collapse in={expandedSections.checkInDetails}>
          <StyledSection>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <StyledFormRow>
                <StyledFormField>
                  <FormControl fullWidth size="small">
                    <InputLabel>Check-in Type</InputLabel>
                    <Select
                      value={formData.check_in_type}
                      onChange={handleSelectChange('check_in_type')}
                      label="Check-in Type"
                    >
                      <MenuItem value="24 Hours CheckIn">24 Hours CheckIn</MenuItem>
                      <MenuItem value="Day Use">Day Use</MenuItem>
                    </Select>
                  </FormControl>
                </StyledFormField>

                <StyledFormField>
                  <DateTimePicker
                    label="Check-in Date & Time"
                    value={formData.check_in_datetime}
                    onChange={(newValue) => onDateChange('check_in_datetime', newValue)}
                    format="dd-MM-yyyy HH:mm"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        variant: 'outlined'
                      }
                    }}
                  />
                </StyledFormField>

                <StyledFormField>
                  <TextField
                    label="No.of Days"
                    value={formData.number_of_days}
                    onChange={onNumberOfDaysChange}
                    fullWidth
                    size="small"
                    variant="outlined"
                    type="number"
                  />
                </StyledFormField>

                <StyledFormField>
                  <DateTimePicker
                    label="Check-out Date & Time"
                    value={formData.check_out_datetime}
                    onChange={(newValue) => onDateChange('check_out_datetime', newValue)}
                    format="dd-MM-yyyy HH:mm"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        variant: 'outlined'
                      }
                    }}
                  />
                </StyledFormField>
              </StyledFormRow>

              <StyledFormRow>
                <StyledFormField>
                  <TextField
                    label="Check-out Grace Time"
                    value={formData.grace_hours}
                    onChange={handleTextFieldChange('grace_hours')}
                    fullWidth
                    size="small"
                    variant="outlined"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                    }}
                  />
                </StyledFormField>

                <StyledFormField>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment By</InputLabel>
                    <Select
                      value={formData.payment_by}
                      onChange={handleSelectChange('payment_by')}
                      label="Payment By"
                    >
                      <MenuItem value="Direct">Direct</MenuItem>
                      <MenuItem value="Company">Company</MenuItem>
                      <MenuItem value="OTA">OTA</MenuItem>
                    </Select>
                  </FormControl>
                </StyledFormField>

                <StyledFormField sx={{ flex: '2 1 400px' }}>
                  <StyledCheckboxGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.allow_charges_posting}
                          onChange={handleCheckboxChange('allow_charges_posting')}
                          color="primary"
                        />
                      }
                      label="Allow Charges Posting"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.enable_paxwise}
                          onChange={handleCheckboxChange('enable_paxwise')}
                          color="primary"
                        />
                      }
                      label="Enable Paxwise"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.enable_room_sharing}
                          onChange={handleCheckboxChange('enable_room_sharing')}
                          color="primary"
                        />
                      }
                      label="Enable Room Sharing"
                    />
                  </StyledCheckboxGroup>
                </StyledFormField>
              </StyledFormRow>
            </LocalizationProvider>
          </StyledSection>
        </Collapse>
      </Paper>

      {/* Address Details Section */}
      <Paper elevation={2}>
        <StyledSectionHeader 
          variant="h6" 
          onClick={() => toggleSection('addressInfo')}
        >
          Address & Additional Information
          {expandedSections.addressInfo ? <ExpandLess /> : <ExpandMore />}
        </StyledSectionHeader>
        
        <Collapse in={expandedSections.addressInfo}>
          <StyledSection>
            <StyledFormRow>
              <StyledFormField>
                <TextField
                  label="GST Number"
                  value={formData.gst_number}
                  onChange={handleTextFieldChange('gst_number')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>

              <StyledFormField>
                <TextField
                  label="Guest Company"
                  value={formData.guest_company}
                  onChange={handleTextFieldChange('guest_company')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>

              <StyledFormField>
                <TextField
                  label="Age"
                  value={formData.age}
                  onChange={handleTextFieldChange('age')}
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="number"
                />
              </StyledFormField>
            </StyledFormRow>

            <StyledFormRow>
              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>GST Type</InputLabel>
                  <Select
                    value={formData.gst_type}
                    onChange={handleSelectChange('gst_type')}
                    label="GST Type"
                  >
                    <MenuItem value="UNREGISTERED">UNREGISTERED</MenuItem>
                    <MenuItem value="REGISTERED">REGISTERED</MenuItem>
                  </Select>
                </FormControl>
              </StyledFormField>

              <StyledFormField>
                <TextField
                  label="Address"
                  value={formData.address}
                  onChange={handleTextFieldChange('address')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>
            </StyledFormRow>

            <StyledFormRow>
              <StyledFormField sx={{ flex: '2 1 400px' }}>
                <TextField
                  label="Visit Remark"
                  value={formData.visit_remark}
                  onChange={handleTextFieldChange('visit_remark')}
                  fullWidth
                  size="small"
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </StyledFormField>

              <StyledFormField>
                <TextField
                  label="City"
                  value={formData.city}
                  onChange={handleTextFieldChange('city')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>

              <StyledFormField>
                <TextField
                  label="Pin Code"
                  value={formData.pin_code}
                  onChange={handleTextFieldChange('pin_code')}
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="number"
                />
              </StyledFormField>

              <StyledFormField>
                <FormControl fullWidth size="small">
                  <InputLabel>Nationality</InputLabel>
                  <Select
                    value={formData.nationality}
                    onChange={handleSelectChange('nationality')}
                    label="Nationality"
                  >
                    <MenuItem value="Indian">Indian</MenuItem>
                    <MenuItem value="Foreign">Foreign</MenuItem>
                  </Select>
                </FormControl>
              </StyledFormField>
            </StyledFormRow>

            <StyledFormRow>
              <StyledFormField>
                <TextField
                  label="Booking Instructions"
                  value={formData.booking_instructions}
                  onChange={handleTextFieldChange('booking_instructions')}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </StyledFormField>

              <StyledFormField sx={{ flex: '2 1 400px' }}>
                <TextField
                  label="Guest Special Instructions"
                  value={formData.guest_special_instructions}
                  onChange={handleTextFieldChange('guest_special_instructions')}
                  fullWidth
                  size="small"
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </StyledFormField>
            </StyledFormRow>

            <Box sx={{ mt: 2 }}>
              <VIPCheckbox
                control={
                  <Checkbox
                    checked={formData.is_vip}
                    onChange={handleCheckboxChange('is_vip')}
                    icon={<Star />}
                    checkedIcon={<Star />}
                    color="warning"
                  />
                }
                label="Mark as VIP Guest"
                checked={formData.is_vip}
              />
            </Box>
          </StyledSection>
        </Collapse>
      </Paper>
    </Box>
  );
});

export default GuestInfoForm;