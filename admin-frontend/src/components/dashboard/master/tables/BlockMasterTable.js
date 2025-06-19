import React, { useEffect, useState } from 'react';
import EnhancedDataTable from '../../../common/EnhancedDataTable';
import api from '../../../../utils/axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';

const headCells = [
  { id: 'block_no', numeric: false, disablePadding: true, label: 'Block No' },
  { id: 'block_name', numeric: false, disablePadding: false, label: 'Block Name' },
  { id: 'created_at', numeric: false, disablePadding: false, label: 'Created Date' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const BlockMasterTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', block_no: '', block_name: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchBlockMasters();
  }, []);

  const fetchBlockMasters = async () => {
    try {
      const response = await api.get('/blockmaster');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching block masters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setFormData({ id: '', block_no: '', block_name: '' });
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setIsEditMode(true);
    setFormData(row);
    setModalOpen(true);
  };

  const handleDelete = async (selectedIds) => {
    if (!window.confirm(`Are you sure you want to delete: ${selectedIds.join(', ')}?`)) return;

    try {
      await Promise.all(selectedIds.map(id => api.delete(`/blockmaster/${id}`)));
      fetchBlockMasters();
    } catch (error) {
      console.error('Error deleting block masters:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({ id: '', block_no: '', block_name: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await api.put(`/ediblockmaster/${formData.id}`, formData);
      } else {
        await api.post('/addblockmaster', formData);
      }
      fetchBlockMasters();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const rowsWithActions = rows.map((row) => ({
    ...row,
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
        title="Block Master"
        rows={rowsWithActions}
        headCells={headCells}
        defaultOrderBy="block_no"
        onAddClick={handleAdd}
        onDeleteClick={handleDelete}
        loading={loading}
      />

      <Modal
        keepMounted
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            {isEditMode ? 'Edit Block' : 'Add New Block'}
          </Typography>

          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              required
              label="Block No"
              variant="outlined"
              name="block_no"
              value={formData.block_no}
              onChange={handleInputChange}
            />
            <TextField
              required
              label="Block Name"
              variant="outlined"
              name="block_name"
              value={formData.block_name}
              onChange={handleInputChange}
            />
            <Button variant="contained" type="submit">
              {isEditMode ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BlockMasterTable;
