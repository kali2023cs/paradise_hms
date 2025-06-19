import React, { useEffect, useState } from 'react';
import EnhancedDataTable from '../../../common/EnhancedDataTable';
import api from '../../../../utils/axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';

const headCells = [
  { id: 'room_no', numeric: false, disablePadding: true, label: 'Room No' },
  { id: 'floor_name', numeric: false, disablePadding: false, label: 'Floor' },
  { id: 'room_type_name', numeric: false, disablePadding: false, label: 'Room Type' },
  { id: 'status_name', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'max_pax', numeric: true, disablePadding: false, label: 'Max Pax' },
  { id: 'max_extra_pax', numeric: true, disablePadding: false, label: 'Max Extra Pax' },
  { id: 'is_active', numeric: false, disablePadding: false, label: 'Active Status' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const RoomMasterTable = () => {
  const [rows, setRows] = useState([]);
  const [floors, setFloors] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    room_no: '',
    display_order: '',
    floor_id: '',
    room_type_id: '',
    status_id: '',
    max_pax: '',
    max_extra_pax: '',
    is_active: 1,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchRoomMasters();
    fetchDropdowns();
  }, []);

  const fetchRoomMasters = async () => {
    setLoading(true);
    try {
      const response = await api.get('/roommaster');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching room masters:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [floorsRes, typesRes, statusesRes] = await Promise.all([
        api.get('/floormaster'),
        api.get('/roomtypemaster'),
        api.get('/roomstatusmaster'),
      ]);
      setFloors(floorsRes.data);
      setRoomTypes(typesRes.data);
      setRoomStatuses(statusesRes.data);
    } catch (error) {
      console.error('Error fetching dropdowns:', error);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setFormData({
      id: '',
      room_no: '',
      display_order: '',
      floor_id: '',
      room_type_id: '',
      status_id: '',
      max_pax: '',
      max_extra_pax: '',
      is_active: 1,
    });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setIsEditMode(true);
    setFormData({
      id: row.id,
      room_no: row.room_no,
      display_order: row.display_order,
      floor_id: row.floor_id,
      room_type_id: row.room_type_id,
      status_id: row.status_id,
      max_pax: row.max_pax,
      max_extra_pax: row.max_extra_pax,
      is_active: row.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (selectedIds) => {
    if (!window.confirm(`Are you sure you want to delete room(s): ${selectedIds.join(', ')}?`)) return;

    try {
      await Promise.all(selectedIds.map(id => api.delete(`/roommaster/${id}`)));
      fetchRoomMasters();
    } catch (error) {
      console.error('Error deleting room masters:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await api.put(`/roommaster/${formData.id}`, formData);
      } else {
        await api.post('/roommaster', formData);
      }
      fetchRoomMasters();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const rowsWithActions = rows.map((row) => ({
    ...row,
    floor_name: floors.find(f => f.id === row.floor_id)?.floor_name || '',
    room_type_name: roomTypes.find(rt => rt.id === row.room_type_id)?.room_type_name || '',
    status_name: roomStatuses.find(rs => rs.id === row.status_id)?.status_name || '',
    is_active: row.is_active ? 'Active' : 'Inactive',
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
      <EnhancedDataTable
        title="Room Master"
        rows={rowsWithActions}
        headCells={headCells}
        defaultOrderBy="room_no"
        onAddClick={handleAdd}
        onDeleteClick={handleDelete}
        loading={loading}
      />

      <Modal
        keepMounted
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="room-master-modal-title"
        aria-describedby="room-master-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="room-master-modal-title" variant="h6" component="h2" mb={3}>
            {isEditMode ? 'Edit Room' : 'Add New Room'}
          </Typography>

          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ mt: 2 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Room No"
                  variant="outlined"
                  name="room_no"
                  value={formData.room_no}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Display Order"
                  variant="outlined"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel id="floor-select-label">Select Floor</InputLabel>
                  <Select
                    labelId="floor-select-label"
                    id="floor-select"
                    name="floor_id"
                    value={formData.floor_id}
                    label="Select Floor"
                    onChange={handleInputChange}
                  >
                    {floors.map((floor) => (
                      <MenuItem key={floor.id} value={floor.id}>
                        {floor.floor_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel id="room-type-select-label">Select Room Type</InputLabel>
                  <Select
                    labelId="room-type-select-label"
                    id="room-type-select"
                    name="room_type_id"
                    value={formData.room_type_id}
                    label="Select Room Type"
                    onChange={handleInputChange}
                  >
                    {roomTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.room_type_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel id="status-select-label">Select Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    name="status_id"
                    value={formData.status_id}
                    label="Select Status"
                    onChange={handleInputChange}
                  >
                    {roomStatuses.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.status_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="active-select-label">Active Status</InputLabel>
                  <Select
                    labelId="active-select-label"
                    id="active-select"
                    name="is_active"
                    value={formData.is_active}
                    label="Active Status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Max Pax"
                  variant="outlined"
                  name="max_pax"
                  type="number"
                  value={formData.max_pax}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Max Extra Pax"
                  variant="outlined"
                  name="max_extra_pax"
                  type="number"
                  value={formData.max_extra_pax}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  type="submit"
                  size="large"
                >
                  {isEditMode ? 'Update' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default RoomMasterTable;