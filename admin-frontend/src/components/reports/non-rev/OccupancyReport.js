import React, { useState } from 'react';
import api from '../../../../src/utils/axios';
import { useAuth } from '../../../utils/AuthContext';
import {
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PDFDownloadLink } from '@react-pdf/renderer';
import UILoader from '../../common/UILoader';
import { format } from 'date-fns';
import OccupancyReportPDF from '../non-rev/pdf/OccupancyReportPDF';

const statusStyles = {
  'Vacant': { bgcolor: '#4caf50', color: '#ffffff' },
  'Occupied': { bgcolor: '#ff9800', color: '#ffffff' },
  'Blocked': { bgcolor: '#f44336', color: '#ffffff' },
  'Maintenance': { bgcolor: '#2196f3', color: '#ffffff' },
  'Dirty': { bgcolor: '#9e9e9e', color: '#ffffff' }
};

const cleaningStatusStyles = {
  'Clean': { bgcolor: '#4caf50', color: '#ffffff' },
  'Dirty': { bgcolor: '#f44336', color: '#ffffff' },
  'default': { bgcolor: '#e0e0e0', color: '#424242' }
};

const maintenanceStatusStyles = {
  'default': { bgcolor: '#2196f3', color: '#ffffff' }
};

const OccupancyReport = () => {
  const { user } = useAuth();
  const [reportDate, setReportDate] = useState(new Date());
  const [blockId, setBlockId] = useState('');
  const [floorId, setFloorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  const handleBlockChange = (e) => {
    const selectedBlockId = e.target.value;
    setBlockId(selectedBlockId);
    setFloorId(''); // Reset floor selection when block changes
    fetchFloors(selectedBlockId || null);
  };

  const fetchBlocks = async () => {
    try {
      const response = await api.get('/blocks');
      setBlocks(response.data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  const fetchFloors = async (blockId = null) => {
    try {
      const url = blockId ? `/floors?block_id=${blockId}` : '/floors';
      const response = await api.get(url);
      setFloors(response.data);
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  React.useEffect(() => {
    fetchBlocks();
    fetchFloors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReportData(null);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await api.post('/generate-occupancy-report', {
        report_date: format(reportDate, 'yyyy-MM-dd'),
        block_id: blockId,
        floor_id: floorId
      });

      if (response.data.success && response.data.records) {
        setReportData({
          reportDate: format(reportDate, 'yyyy-MM-dd'),
          user,
          reportData: response.data.records,
          filter: {
            block: blocks.find(b => b.id === blockId)?.block_name || 'All Blocks',
            floor: floors.find(f => f.id === floorId)?.floor_name || 'All Floors'
          }
        });
        setSuccess('Occupancy report generated successfully');
      } else {
        setError(response.data.message || 'No records found for the selected criteria.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const StatusIndicator = ({ status }) => {
    const styles = statusStyles[status] || { bgcolor: '#e0e0e0', color: '#424242' };
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 0.6,
          borderRadius: 20,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          minWidth: 90,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          textTransform: 'uppercase',
          ...styles
        }}
      >
        {status}
      </Box>
    );
  };

  const CleaningStatusIndicator = ({ status }) => {
    const styles = cleaningStatusStyles[status] || cleaningStatusStyles.default;
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 0.6,
          borderRadius: 20,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          minWidth: 70,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          textTransform: 'uppercase',
          ...styles
        }}
      >
        {status || 'N/A'}
      </Box>
    );
  };

  const MaintenanceStatusIndicator = ({ status }) => {
    const styles = maintenanceStatusStyles.default;
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 0.6,
          borderRadius: 20,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          minWidth: 100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          textTransform: 'uppercase',
          ...styles
        }}
      >
        {status || 'N/A'}
      </Box>
    );
  };

  return (
    <Paper sx={{
      p: 4,
      borderRadius: 2,
      bgcolor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: 1200,
      mx: 'auto',
      position: 'relative'
    }}>
      {loading && <UILoader />}
      
      <Typography variant="h4" sx={{
        mb: 4,
        color: '#1976d2',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        Room Occupancy Report
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Report Date"
                value={reportDate}
                onChange={setReportDate}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    required 
                    helperText="Date for occupancy snapshot"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* <TextField
              select
              label="Block"
              value={blockId}
              onChange={handleBlockChange}
              fullWidth
              helperText="Filter by block (optional)"
            >
              <MenuItem value="">All Blocks</MenuItem>
              {blocks.map((block) => (
                <MenuItem key={block.id} value={block.id}>
                  {block.block_name} ({block.block_no})
                </MenuItem>
              ))}
            </TextField> */}
          </Grid>

          <Grid item xs={12} md={4}>
            {/* <TextField
              select
              label="Floor"
              value={floorId}
              onChange={(e) => setFloorId(e.target.value)}
              fullWidth
              helperText="Filter by floor (optional)"
            >
              <MenuItem value="">All Floors</MenuItem>
              {floors.map((floor) => (
                <MenuItem key={floor.id} value={floor.id}>
                  {floor.floor_name} (Block: {blocks.find(b => b.id === floor.block_id)?.block_no || 'N/A'})
                </MenuItem>
              ))}
            </TextField> */}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 2,
              gap: 2
            }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1rem',
                  minWidth: 180
                }}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              
              {reportData && (
                <PDFDownloadLink
                  document={<OccupancyReportPDF data={reportData} />}
                  fileName={`Occupancy_Report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`}
                >
                  {({ loading }) => (
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ 
                        px: 4, 
                        py: 1.5, 
                        fontSize: '1rem',
                        minWidth: 180
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Preparing PDF...' : 'Download PDF'}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>

      {reportData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Occupancy Summary for {reportData.reportDate}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room No</TableCell>
                  <TableCell>Block/Floor</TableCell>
                  <TableCell>Room Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Cleaning</TableCell>
                  <TableCell>Maintenance</TableCell>
                  <TableCell>Guest/Reason</TableCell>
                  <TableCell>Check-In/Out</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.reportData.map((room) => (
                  <TableRow key={room.room_id}>
                    <TableCell>{room.room_no}</TableCell>
                    <TableCell>{room.block_name} / {room.floor_name}</TableCell>
                    <TableCell>{room.room_type_name}</TableCell>
                    <TableCell>
                      <StatusIndicator status={room.room_status} />
                    </TableCell>
                    <TableCell>
                      {room.cleaning_status && (
                        <CleaningStatusIndicator status={room.cleaning_status} />
                      )}
                    </TableCell>
                    <TableCell>
                      {room.maintenance_status && (
                        <MaintenanceStatusIndicator status={room.maintenance_status} />
                      )}
                    </TableCell>
                    <TableCell>
                      {room.guest_name || room.block_reason || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {room.check_in_date && (
                        <div>
                          <div>In: {room.check_in_date}</div>
                          {room.check_out_date && <div>Out: {room.check_out_date}</div>}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Alerts */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default OccupancyReport;