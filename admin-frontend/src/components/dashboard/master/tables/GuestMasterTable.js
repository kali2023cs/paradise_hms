import React, { useEffect, useState } from 'react';
import EnhancedDataTable from '../../../common/EnhancedDataTable';
import api from '../../../../utils/axios';
import UILoder from '../../../common/UILoader';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const headCells = [
  { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
  { id: 'first_name', numeric: false, disablePadding: false, label: 'First Name' },
  { id: 'last_name', numeric: false, disablePadding: false, label: 'Last Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
  { id: 'is_vip', numeric: false, disablePadding: false, label: 'VIP' },
  { id: 'created_at', numeric: false, disablePadding: false, label: 'Created Date' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 1000,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const GuestMasterTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [titles, setTitles] = useState([]);
  const [idTypes, setIdTypes] = useState([]);
  const [formData, setFormData] = useState({ 
    id: '', 
    title_id: '',
    first_name: '', 
    last_name: '', 
    gender: 'Male',
    date_of_birth: null,
    email: '', 
    phone: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    id_type: '',
    id_number: '',
    id_document: null,
    nationality: '',
    profile_photo: null,
    company_name: '',
    company_address: '',
    gst_number: '',
    gst_type: '',
    is_vip: false,
    vip_level: '',
    is_blacklisted: false,
    blacklist_reason: '',
    remarks: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [idDocumentPreview, setIdDocumentPreview] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  useEffect(() => {
    fetchGuestMasters();
    fetchTitles();
    fetchIdTypes();
  }, []);

  const fetchGuestMasters = async () => {
    try {
      const response = await api.get('/guestmaster');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching guest masters:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTitles = async () => {
    try {
      const response = await api.get('/titlemaster');
      setTitles(response.data);
    } catch (error) {
      console.error('Error fetching titles:', error);
    }
  };

  const fetchIdTypes = async () => {
    try {
      const response = await api.get('/idmaster');
      setIdTypes(response.data);
    } catch (error) {
      console.error('Error fetching ID types:', error);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setFormData({ 
      id: '', 
      title_id: '',
      first_name: '', 
      last_name: '', 
      gender: 'Male',
      date_of_birth: null,
      email: '', 
      phone: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      id_type: '',
      id_number: '',
      id_document: null,
      nationality: '',
      profile_photo: null,
      company_name: '',
      company_address: '',
      gst_number: '',
      gst_type: '',
      is_vip: false,
      vip_level: '',
      is_blacklisted: false,
      blacklist_reason: '',
      remarks: ''
    });
    setIdDocumentPreview(null);
    setProfilePhotoPreview(null);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setIsEditMode(true);
    setFormData({
      ...row,
      title_id: row.title_id || '',
      id_type: row.id_type || '',
      date_of_birth: row.date_of_birth ? new Date(row.date_of_birth) : null,
      is_vip: row.is_vip === 1 || row.is_vip === true,
      is_blacklisted: row.is_blacklisted === 1 || row.is_blacklisted === true
    });
    if (row.id_document) {
      setIdDocumentPreview(row.id_document);
    }
    if (row.profile_photo) {
      setProfilePhotoPreview(row.profile_photo);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/guestmaster/${id}`);
      fetchGuestMasters();
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (name === 'id_document') {
          setIdDocumentPreview(event.target.result);
        } else if (name === 'profile_photo') {
          setProfilePhotoPreview(event.target.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'id_document' || key === 'profile_photo') {
          if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
          }
        } else if (key === 'date_of_birth' && formData[key]) {
          // Format date to YYYY-MM-DD
          const date = new Date(formData[key]);
          const formattedDate = date.toISOString().split('T')[0];
          formDataToSend.append(key, formattedDate);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (isEditMode) {
        await api.put(`/guestmaster/${formData.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/guestmaster', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      fetchGuestMasters();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const rowsWithActions = rows.map((row) => ({
    ...row,
    title: titles.find(t => t.id === row.title_id)?.title_name || '',
    is_vip: row.is_vip ? 'Yes' : 'No',
    actions: (
      <Button
        size="small"
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(row);
        }}
      >
        Edit
      </Button>
    ),
  }));

  return (
    <>
      {loading ? (
        <UILoder />
      ) : (
        <EnhancedDataTable
          title="Guest Master"
          rows={rowsWithActions}
          headCells={headCells}
          defaultOrderBy="first_name"
          onAddClick={handleAdd}
          onDeleteClick={handleDelete}
        />
      )}

      <Modal
        keepMounted
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            {isEditMode ? 'Edit Guest' : 'Add New Guest'}
          </Typography>

          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="title-select-label">Title</InputLabel>
                <Select
                  labelId="title-select-label"
                  id="title_id"
                  name="title_id"
                  value={formData.title_id}
                  label="Title"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {titles.map((title) => (
                    <MenuItem key={title.id} value={title.id}>
                      {title.title_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                required
                fullWidth
                label="First Name"
                variant="outlined"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />

              <TextField
                required
                fullWidth
                label="Last Name"
                variant="outlined"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.date_of_birth}
                  onChange={(newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      date_of_birth: newValue
                    }));
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="Phone"
                variant="outlined"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="Mobile"
                variant="outlined"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
              />
            </Box>

            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              multiline
              rows={2}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="State"
                variant="outlined"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="Postal Code"
                variant="outlined"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="id-type-label">ID Type</InputLabel>
                <Select
                  labelId="id-type-label"
                  id="id_type"
                  name="id_type"
                  value={formData.id_type}
                  label="ID Type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {idTypes.map((idType) => (
                    <MenuItem key={idType.id} value={idType.id}>
                      {idType.id_type} - {idType.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="ID Number"
                variant="outlined"
                name="id_number"
                value={formData.id_number}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload ID Document
                <VisuallyHiddenInput 
                  type="file" 
                  name="id_document"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
              </Button>
              {idDocumentPreview && (
                <Box>
                  {idDocumentPreview.endsWith('.pdf') ? (
                    <Typography>PDF document uploaded</Typography>
                  ) : (
                    <img 
                      src={idDocumentPreview} 
                      alt="ID Document Preview" 
                      style={{ maxHeight: 100, maxWidth: 100 }} 
                    />
                  )}
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Nationality"
                variant="outlined"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
              />

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Profile Photo
                  <VisuallyHiddenInput 
                    type="file" 
                    name="profile_photo"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Button>
                {profilePhotoPreview && (
                  <img 
                    src={profilePhotoPreview} 
                    alt="Profile Preview" 
                    style={{ maxHeight: 100, maxWidth: 100 }} 
                  />
                )}
              </Box>
            </Box>

            <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
              Company Information
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="GST Number"
                variant="outlined"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="GST Type"
                variant="outlined"
                name="gst_type"
                value={formData.gst_type}
                onChange={handleInputChange}
              />
            </Box>

            <TextField
              fullWidth
              label="Company Address"
              variant="outlined"
              name="company_address"
              value={formData.company_address}
              onChange={handleInputChange}
              multiline
              rows={2}
            />

            <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
              VIP & Blacklist Information
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_vip}
                    onChange={handleInputChange}
                    name="is_vip"
                  />
                }
                label="Is VIP"
              />

              {formData.is_vip && (
                <TextField
                  fullWidth
                  label="VIP Level"
                  variant="outlined"
                  name="vip_level"
                  value={formData.vip_level}
                  onChange={handleInputChange}
                />
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_blacklisted}
                    onChange={handleInputChange}
                    name="is_blacklisted"
                  />
                }
                label="Is Blacklisted"
              />
            </Box>

            {formData.is_blacklisted && (
              <TextField
                fullWidth
                label="Blacklist Reason"
                variant="outlined"
                name="blacklist_reason"
                value={formData.blacklist_reason}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            )}

            <TextField
              fullWidth
              label="Remarks"
              variant="outlined"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              multiline
              rows={2}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                {isEditMode ? 'Update' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default GuestMasterTable;