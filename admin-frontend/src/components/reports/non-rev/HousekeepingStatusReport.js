import React, { useState, useEffect } from 'react';
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
  TableRow,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PDFDownloadLink } from '@react-pdf/renderer';
import UILoader from '../../common/UILoader';
import { format } from 'date-fns';
import HousekeepingStatusPDF from '../non-rev/pdf/HousekeepingStatusPDF';

const cleaningStatusStyles = {
  'Clean': { bgcolor: '#4caf50', color: '#ffffff' },
  'Dirty': { bgcolor: '#f44336', color: '#ffffff' },
  'In Progress': { bgcolor: '#ff9800', color: '#ffffff' },
  'Inspected': { bgcolor: '#2196f3', color: '#ffffff' },
  'Out of Service': { bgcolor: '#9e9e9e', color: '#ffffff' }
};

const timeTakenStyles = {
  'Overdue': { bgcolor: '#ff5252', color: '#ffffff' },
  'Fast': { bgcolor: '#4caf50', color: '#ffffff' },
  'default': { bgcolor: '#e0e0e0', color: '#424242' }
};

const HousekeepingStatusReport = () => {
  const { user } = useAuth();
  const [reportDate, setReportDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('All');
  const [cleanerFilter, setCleanerFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cleaners, setCleaners] = useState([]);
  const [cleaningStatuses, setCleaningStatuses] = useState([]);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
    setSuccess(null);
  };

  const fetchCleaners = async () => {
    try {
      const response = await api.get('/cleaners');
      setCleaners(response.data);
    } catch (error) {
      console.error('Error fetching cleaners:', error);
    }
  };

  const fetchCleaningStatuses = async () => {
    try {
      const response = await api.get('/cleaning-statuses');
      setCleaningStatuses(response.data);
    } catch (error) {
      console.error('Error fetching cleaning statuses:', error);
    }
  };

  useEffect(() => {
    fetchCleaners();
    fetchCleaningStatuses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReportData(null);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await api.post('/generate-housekeeping-report', {
        report_date: format(reportDate, 'yyyy-MM-dd'),
        status: statusFilter,
        cleaner_id: cleanerFilter
      });

      if (response.data.success && response.data.records) {
        setReportData({
          reportDate: format(reportDate, 'yyyy-MM-dd'),
          user,
          reportData: response.data.records,
          filter: {
            status: statusFilter === 'All' ? 'All Statuses' : statusFilter,
            cleaner: cleaners.find(c => c.id === cleanerFilter)?.name || 'All Cleaners'
          }
        });
        setSuccess('Housekeeping report generated successfully');
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

  const CleaningStatusIndicator = ({ status }) => {
    const styles = cleaningStatusStyles[status] || { bgcolor: '#e0e0e0', color: '#424242' };
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 0.6,
          borderRadius: 20,
          fontSize: '0.55rem',
          fontWeight: 'bold',
          minWidth: 100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          ...styles
        }}
      >
        {status}
      </Box>
    );
  };

  const TimeTakenIndicator = ({ timeTaken }) => {
    let styles = timeTakenStyles.default;
    
    if (timeTaken) {
      if (timeTaken.includes('Overdue')) {
        styles = timeTakenStyles['Overdue'];
      } else if (timeTaken.includes('Fast')) {
        styles = timeTakenStyles['Fast'];
      }
    }
    
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 0.6,
          borderRadius: 20,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          minWidth: 80,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          ...styles
        }}
      >
        {timeTaken || 'N/A'}
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
        Housekeeping Status Report
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
                    helperText="Date for cleaning status snapshot"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Cleaning Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="All">All Statuses</MenuItem>
              {cleaningStatuses.map((status) => (
                <MenuItem key={status.id} value={status.status_name}>
                  {status.status_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Cleaner"
              value={cleanerFilter}
              onChange={(e) => setCleanerFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="">All Cleaners</MenuItem>
              {cleaners.map((cleaner) => (
                <MenuItem key={cleaner.id} value={cleaner.id}>
                  {cleaner.name} ({cleaner.shift})
                </MenuItem>
              ))}
            </TextField>
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
                  document={<HousekeepingStatusPDF data={reportData} />}
                  fileName={`Housekeeping_Report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`}
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
            Housekeeping Status for {reportData.reportDate}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room No</TableCell>
                  <TableCell>Block/Floor</TableCell>
                  <TableCell>Room Type</TableCell>
                  <TableCell>Cleaning Status</TableCell>
                  <TableCell>Cleaner</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Time Taken</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.reportData.map((room) => (
                  <TableRow key={room.room_id}>
                    <TableCell>{room.room_no}</TableCell>
                    <TableCell>{room.block_name}/{room.floor_name}</TableCell>
                    <TableCell>{room.room_type_name}</TableCell>
                    <TableCell>
                      <CleaningStatusIndicator status={room.cleaning_status} />
                    </TableCell>
                    <TableCell>{room.cleaner_name || 'N/A'}</TableCell>
                    <TableCell>{room.started_at || 'N/A'}</TableCell>
                    <TableCell>{room.completed_at || 'N/A'}</TableCell>
                    <TableCell>
                      <TimeTakenIndicator timeTaken={room.time_taken} />
                    </TableCell>
                    <TableCell>{room.remarks || 'N/A'}</TableCell>
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

export default HousekeepingStatusReport;