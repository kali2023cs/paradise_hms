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
import MaintenanceTrackingPDF from '../non-rev/pdf/MaintenanceTrackingPDF';

const statusStyles = {
  'Reported': { bgcolor: '#b3e5fc', color: '#01579b' },
  'In Progress': { bgcolor: '#fff176', color: '#f57f17' },
  'Resolved': { bgcolor: '#a5d6a7', color: '#1b5e20' },
  'Pending Parts': { bgcolor: '#80deea', color: '#006064' },
  'Escalated': { bgcolor: '#ff8a65', color: '#bf360c' }
};

const priorityStyles = {
  'Low': { bgcolor: '#c8e6c9', color: '#2e7d32' },
  'Medium': { bgcolor: '#ffecb3', color: '#ff8f00' },
  'High': { bgcolor: '#ffcc80', color: '#e65100' },
  'Emergency': { bgcolor: '#ff9e80', color: '#d84315' }
};

const timeTakenStyles = {
  'Overdue': { bgcolor: '#ffcdd2', color: '#c62828' },
  'Fast': { bgcolor: '#b2dfdb', color: '#00695c' },
  'default': { bgcolor: '#e0e0e0', color: '#424242' }
};

const MaintenanceTrackingReport = () => {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const fetchMaintenanceTypes = async () => {
    try {
      const response = await api.get('/maintenance-types');
      setMaintenanceTypes(response.data);
    } catch (error) {
      console.error('Error fetching maintenance types:', error);
    }
  };

  const fetchStatusOptions = async () => {
    try {
      const response = await api.get('/maintenance-statuses');
      setStatusOptions(response.data);
    } catch (error) {
      console.error('Error fetching status options:', error);
    }
  };

  useEffect(() => {
    fetchMaintenanceTypes();
    fetchStatusOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReportData(null);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await api.post('/generate-maintenance-report', {
        from_date: format(fromDate, 'yyyy-MM-dd'),
        to_date: format(toDate, 'yyyy-MM-dd'),
        status: statusFilter,
        priority: priorityFilter,
        type_id: typeFilter
      });

      if (response.data.success && response.data.records) {
        setReportData({
          fromDate: format(fromDate, 'yyyy-MM-dd'),
          toDate: format(toDate, 'yyyy-MM-dd'),
          user,
          reportData: response.data.records,
          filter: {
            status: statusFilter === 'All' ? 'All Statuses' : statusFilter,
            priority: priorityFilter === 'All' ? 'All Priorities' : priorityFilter,
            type: maintenanceTypes.find(t => t.id == typeFilter)?.issue_type || 'All Types'
          }
        });
        setSuccess('Maintenance report generated successfully');
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
          px: 2,
          py: 0.8,
          borderRadius: 20, // Pill shape
          fontSize: '0.75rem',
          fontWeight: 'bold',
          minWidth: 100,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          ...styles
        }}
      >
        {status}
      </Box>
    );
  };

  const PriorityIndicator = ({ priority }) => {
    const styles = priorityStyles[priority] || { bgcolor: '#e0e0e0', color: '#424242' };
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 0.8,
          borderRadius: 20, // Pill shape
          fontSize: '0.75rem',
          fontWeight: 'bold',
          minWidth: 90,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          ...styles
        }}
      >
        {priority}
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
          py: 0.8,
          borderRadius: 20, // Pill shape
          fontSize: '0.75rem',
          fontWeight: 'bold',
          minWidth: 90,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
      maxWidth: 1400,
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
        Maintenance Tracking Report
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
                    helperText="Start date for maintenance issues"
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
                    helperText="End date for maintenance issues"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="All">All Statuses</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status.id} value={status.status_name}>
                  {status.status_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              label="Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="All">All Priorities</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              label="Maintenance Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="All">All Types</MenuItem>
              {maintenanceTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.issue_type}
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
                  document={<MaintenanceTrackingPDF data={reportData} />}
                  fileName={`Maintenance_Report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`}
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
            Maintenance Issues from {reportData.fromDate} to {reportData.toDate}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room No</TableCell>
                  <TableCell>Issue Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Reported On</TableCell>
                  <TableCell>Technician</TableCell>
                  <TableCell>Time Taken</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.reportData.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>{issue.room_no}</TableCell>
                    <TableCell>{issue.issue_type}</TableCell>
                    <TableCell>
                      <PriorityIndicator priority={issue.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusIndicator status={issue.status} />
                    </TableCell>
                    <TableCell>{issue.reported_by}</TableCell>
                    <TableCell>{issue.reported_date}</TableCell>
                    <TableCell>{issue.technician || 'Unassigned'}</TableCell>
                    <TableCell>
                      <TimeTakenIndicator timeTaken={issue.time_taken} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>{issue.description}</TableCell>
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

export default MaintenanceTrackingReport;