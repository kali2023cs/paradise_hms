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
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

const headCells = [
    { id: 'room_type_code', numeric: false, disablePadding: true, label: 'Code' },
    { id: 'room_type_name', numeric: false, disablePadding: false, label: 'Room Type Name' },
    { id: 'plan_name', numeric: false, disablePadding: false, label: 'Default Plan' },
    { id: 'max_adult_pax', numeric: false, disablePadding: false, label: 'Max Adults' },
    { id: 'max_child_pax', numeric: false, disablePadding: false, label: 'Max Children' },
    { id: 'roomtype_status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxWidth: 800,
    minWidth: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 0,
    maxHeight: '90vh',
    overflowY: 'auto',
};

const RoomTypeMasterTable = () => {
    const [rows, setRows] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        room_type_code: '',
        room_type_name: '',
        default_plan_id: '',
        display_order: '',
        wifi_plan_id: '',
        max_adult_pax: '',
        max_child_pax: '',
        max_extra_pax: '',
        negative_count: '',
        roomtype_status: 'Active',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchRoomTypes();
        fetchPlans();
    }, []);

    const fetchRoomTypes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/roomtypemaster');
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching room types:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const response = await api.get('/plans');
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleAdd = () => {
        setIsEditMode(false);
        setCurrentId(null);
        setFormData({
            room_type_code: '',
            room_type_name: '',
            default_plan_id: '',
            display_order: '',
            wifi_plan_id: '',
            max_adult_pax: '',
            max_child_pax: '',
            max_extra_pax: '',
            negative_count: '',
            roomtype_status: 'Active',
        });
        setModalOpen(true);
    };

    const handleEdit = (row) => {
        setIsEditMode(true);
        setCurrentId(row.id);
        setFormData({
            room_type_code: row.room_type_code,
            room_type_name: row.room_type_name,
            default_plan_id: row.default_plan?.id || '',
            display_order: row.display_order,
            wifi_plan_id: row.wifi_plan_id,
            max_adult_pax: row.max_adult_pax,
            max_child_pax: row.max_child_pax,
            max_extra_pax: row.max_extra_pax,
            negative_count: row.negative_count,
            roomtype_status: row.roomtype_status,
        });
        setModalOpen(true);
    };

    const handleDelete = async (selectedIds) => {
        if (!window.confirm(`Delete selected room types: ${selectedIds.join(', ')}?`)) return;
        try {
            await Promise.all(selectedIds.map(id => api.delete(`/roomtypemaster/${id}`)));
            fetchRoomTypes();
        } catch (error) {
            console.error('Error deleting room types:', error);
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
                await api.put(`/roomtypemaster/${currentId}`, formData);
            } else {
                await api.post('/roomtypemaster', formData);
            }
            fetchRoomTypes();
            handleCloseModal();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const rowsWithActions = rows.map((row) => ({
        ...row,
        plan_name: row.default_plan?.plan_name || 'N/A',
        actions: (
            <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row);
                }}
                sx={{ minWidth: 100 }}
            >
                Edit
            </Button>
        ),
    }));

    return (
        <>
            <EnhancedDataTable
                title="Room Type Master"
                rows={rowsWithActions}
                headCells={headCells}
                defaultOrderBy="room_type_code"
                onAddClick={handleAdd}
                onDeleteClick={handleDelete}
                loading={loading}
            />

            <Modal
                keepMounted
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="roomtype-master-modal-title"
                aria-describedby="roomtype-master-modal-description"
            >
                <Box sx={modalStyle}>
                    <Box sx={{
                        p: 3,
                        position: 'sticky',
                        top: 0,
                        bgcolor: 'background.paper',
                        zIndex: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6" component="h2">
                            {isEditMode ? 'Edit Room Type' : 'Add New Room Type'}
                        </Typography>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseModal}
                            sx={{
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            {/* First Row */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Code"
                                    name="room_type_code"
                                    value={formData.room_type_code}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    inputProps={{ maxLength: 10 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Room Type Name"
                                    name="room_type_name"
                                    value={formData.room_type_name}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    inputProps={{ maxLength: 100 }}
                                />
                            </Grid>

                            {/* Second Row */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="default-plan-label">Default Plan</InputLabel>
                                    <Select
                                        labelId="default-plan-label"
                                        name="default_plan_id"
                                        value={formData.default_plan_id}
                                        onChange={handleInputChange}
                                        label="Default Plan"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {plans.map((plan) => (
                                            <MenuItem key={plan.id} value={plan.id}>
                                                {plan.plan_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Display Order"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            {/* Third Row */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Wifi Plan ID"
                                    name="wifi_plan_id"
                                    value={formData.wifi_plan_id}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="roomtype_status"
                                        value={formData.roomtype_status}
                                        onChange={handleInputChange}
                                        label="Status"
                                        required
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Section Header */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                                    Capacity Settings
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            {/* Capacity Settings Row */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Max Adult Pax"
                                    name="max_adult_pax"
                                    value={formData.max_adult_pax}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Max Child Pax"
                                    name="max_child_pax"
                                    value={formData.max_child_pax}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Max Extra Pax"
                                    name="max_extra_pax"
                                    value={formData.max_extra_pax}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Negative Count"
                                    name="negative_count"
                                    value={formData.negative_count}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            {/* Action Buttons */}
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleCloseModal}
                                        sx={{ minWidth: 100 }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ minWidth: 100 }}
                                    >
                                        {isEditMode ? 'Update' : 'Save'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default RoomTypeMasterTable;