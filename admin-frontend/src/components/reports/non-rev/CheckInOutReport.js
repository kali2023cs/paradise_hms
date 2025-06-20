import React, { useState } from 'react';
import api from '../../../../src/utils/axios';
import { useAuth } from '../../../utils/AuthContext';
import {
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  Button,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PDFDownloadLink } from '@react-pdf/renderer';
import UILoader from '../../common/UILoader';
import { format, startOfDay, endOfDay } from 'date-fns';
import CheckInOutReportPDF from '../non-rev/pdf/CheckInOutReportPDF';

const purposeOptions = [
  'Daily Operations',
  'Audit Trail',
  'Guest Activity',
  'Staff Review',
  'Management Report'
];

const CheckInOutReport = () => {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [purpose, setPurpose] = useState(purposeOptions[0]);
  const [reportType, setReportType] = useState('checkin');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReportData(null);
    setError(null);
    setSuccess(null);
    
    try {
      const fromDateStart = startOfDay(new Date(fromDate));
      const toDateEnd = endOfDay(new Date(toDate));

      const response = await api.post('/generate-checkinout-report', {
        fromdate: Math.floor(fromDateStart.getTime() / 1000),
        todate: Math.floor(toDateEnd.getTime() / 1000),
        purpose,
        type: reportType
      });

      if (response.data.success && response.data.records) {
        setReportData({
          fromDate: format(fromDate, 'yyyy-MM-dd'),
          toDate: format(toDate, 'yyyy-MM-dd'),
          purpose,
          reportType,
          user,
          reportData: response.data.records,
          hotelDetails: response.data.hotelDetails || null
        });
        setSuccess('Report generated successfully');
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

  return (
    <Paper sx={{
      p: 4,
      borderRadius: 2,
      bgcolor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: 800,
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
        Check-In/Check-Out Report
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Date Pickers (Same as before) */}
          <Grid item xs={12} md={6}>
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
                    helperText="Start date for the report period"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
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
                    helperText="End date for the report period"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* Purpose Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              label="Report Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              fullWidth
              required
              helperText="Select the purpose for this report"
            >
              {purposeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Report Type Toggle */}
          <Grid item xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
                Report Data Type
              </FormLabel>
              <RadioGroup
                row
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <FormControlLabel
                  value="checkin"
                  control={<Radio color="primary" />}
                  label="Check-in Records"
                />
                <FormControlLabel
                  value="checkout"
                  control={<Radio color="primary" />}
                  label="Check-out Records"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ px: 4, py: 1.5, fontSize: '1rem', minWidth: 180 }}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              
              {reportData && (
                <PDFDownloadLink
                  document={<CheckInOutReportPDF data={reportData} />}
                  fileName={`CheckInOut_Report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`}
                >
                  {({ loading }) => (
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ px: 4, py: 1.5, fontSize: '1rem', minWidth: 180 }}
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

      {/* Alerts (Same as before) */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success">{success}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default CheckInOutReport;