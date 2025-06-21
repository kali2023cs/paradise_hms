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
  Chip,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { format, differenceInDays, parseISO } from 'date-fns';
import RoomBlockingPDF from '../non-rev/pdf/RoomBlockingPDF';

const reasonColors = {
  'Maintenance': 'warning',
  'Renovation': 'secondary',
  'VIP': 'success',
  'Out of Order': 'error',
  'Other': 'info'
};

const RoomBlockingReport = () => {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [reasonFilter, setReasonFilter] = useState('All');
  const [blockedByFilter, setBlockedByFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [reasons, setReasons] = useState([]);
  const [blockers, setBlockers] = useState([]);

  const fetchReasons = async () => {
    try {
      const response = await api.get('/block-reasons');
      if (response.data.success) {
        setReasons(response.data.reasons || []);
      }
    } catch (error) {
      console.error('Error fetching block reasons:', error);
      setError('Failed to load block reasons');
    }
  };

  const fetchBlockers = async () => {
    try {
      const response = await api.get('/room-blockers');
      if (response.data.success) {
        setBlockers(response.data.blockers || []);
      }
    } catch (error) {
      console.error('Error fetching blockers:', error);
      setError('Failed to load room blockers');
    }
  };

  useEffect(() => {
    fetchReasons();
    fetchBlockers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (toDate < fromDate) {
      setError('End date cannot be before start date');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/generate-blocking-report', {
        from_date: format(fromDate, 'yyyy-MM-dd'),
        to_date: format(toDate, 'yyyy-MM-dd'),
        reason: reasonFilter,
        blocked_by: blockedByFilter
      });

      if (response.data.success) {
        setReportData({
          fromDate: format(fromDate, 'yyyy-MM-dd'),
          toDate: format(toDate, 'yyyy-MM-dd'),
          user,
          reportData: response.data.records || [],
          filter: {
            reason: reasonFilter === 'All' ? 'All Reasons' : reasonFilter,
            blockedBy: blockedByFilter === 'All' ? 'All Users' : 
              blockers.find(b => b.id == blockedByFilter)?.name || blockedByFilter
          }
        });
        setSuccess('Report generated successfully');
      } else {
        setError(response.data.message || 'No data found');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const calculateBlockDuration = (start, end) => {
    const days = differenceInDays(parseISO(end), parseISO(start));
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <Paper sx={{
      p: 4,
      borderRadius: 2,
      bgcolor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: 1400,
      mx: 'auto',
      position: 'relative'
    }}>
      {loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />}
      
      <Typography variant="h4" sx={{
        mb: 4,
        color: '#1976d2',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        Room Blocking Analysis Report
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={setFromDate}
                maxDate={toDate}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    required 
                    helperText="Start date for blocks"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={setToDate}
                minDate={fromDate}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    required 
                    helperText="End date for blocks"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Block Reason"
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="All">All Reasons</MenuItem>
              {reasons.map((reason, index) => (
                <MenuItem key={index} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Blocked By"
              value={blockedByFilter}
              onChange={(e) => setBlockedByFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="All">All Users</MenuItem>
              {blockers.map((blocker) => (
                <MenuItem key={blocker.id} value={blocker.id}>
                  {blocker.name} ({blocker.role})
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
                  document={<RoomBlockingPDF data={reportData} />}
                  fileName={`Room_Blocking_Report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`}
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

      {reportData && reportData.reportData.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Room Blocks from {reportData.fromDate} to {reportData.toDate}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room No</TableCell>
                  <TableCell>Block Reason</TableCell>
                  <TableCell>Blocked By</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.reportData.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell>{block.room_no}</TableCell>
                    <TableCell>
                      <Chip 
                        label={block.reason} 
                        color={reasonColors[block.reason] || 'default'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{block.blocked_by}</TableCell>
                    <TableCell>{block.from_date}</TableCell>
                    <TableCell>{block.to_date}</TableCell>
                    <TableCell>
                      {calculateBlockDuration(block.from_date, block.to_date)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={block.current_status} 
                        color={
                          block.current_status === 'Active' ? 'warning' :
                          block.current_status === 'Expired' ? 'default' : 'success'
                        } 
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : reportData && reportData.reportData.length === 0 ? (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No room blocks found for the selected criteria
          </Typography>
        </Box>
      ) : null}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RoomBlockingReport;