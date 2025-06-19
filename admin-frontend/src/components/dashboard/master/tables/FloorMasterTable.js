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

const headCells = [
  { id: 'floor_no', numeric: false, disablePadding: true, label: 'Floor No' },
  { id: 'floor_name', numeric: false, disablePadding: false, label: 'Floor Name' },
  { id: 'block_name', numeric: false, disablePadding: false, label: 'Block Name' },
  { id: 'created_at', numeric: false, disablePadding: false, label: 'Created Date' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const FloorMasterTable = () => {
  const [rows, setRows] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    floor_no: '',
    floor_name: '',
    block_id: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchFloorMasters();
    fetchBlocks();
  }, []);

  const fetchFloorMasters = async () => {
    setLoading(true);
    try {
      const response = await api.get('/floormaster');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching floor masters:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlocks = async () => {
    try {
      const response = await api.get('/blockmaster');
      setBlocks(response.data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setFormData({ id: '', floor_no: '', floor_name: '', block_id: '' });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setIsEditMode(true);
    setFormData({
      id: row.id,
      floor_no: row.floor_no,
      floor_name: row.floor_name,
      block_id: row.block?.id || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (selectedIds) => {
    if (!window.confirm(`Are you sure you want to delete: ${selectedIds.join(', ')}?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/floormaster/${id}`)));
      fetchFloorMasters();
    } catch (error) {
      console.error('Error deleting floor masters:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({ id: '', floor_no: '', floor_name: '', block_id: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/floormaster/${formData.id}`, formData);
      } else {
        await api.post('/floormaster', formData);
      }
      fetchFloorMasters();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const rowsWithActions = rows.map((row) => ({
    ...row,
    block_name: row.block?.block_name || '',
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
        title="Floor Master"
        rows={rowsWithActions}
        headCells={headCells}
        defaultOrderBy="floor_no"
        onAddClick={handleAdd}
        onDeleteClick={handleDelete}
        loading={loading}
      />

      <Modal
        keepMounted
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="floor-master-modal-title"
        aria-describedby="floor-master-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="floor-master-modal-title" variant="h6">
            {isEditMode ? 'Edit Floor' : 'Add New Floor'}
          </Typography>

          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              required
              label="Floor No"
              name="floor_no"
              value={formData.floor_no}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              required
              label="Floor Name"
              name="floor_name"
              value={formData.floor_name}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel id="block-select-label">Select Block</InputLabel>
              <Select
                labelId="block-select-label"
                name="block_id"
                value={formData.block_id}
                onChange={handleInputChange}
              >
                {blocks.map((block) => (
                  <MenuItem key={block.id} value={block.id}>
                    {block.block_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" type="submit">
              {isEditMode ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default FloorMasterTable;
