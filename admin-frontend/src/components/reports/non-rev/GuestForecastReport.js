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
import UILoader from '../../common/UILoader';
import { format, addDays, parseISO } from 'date-fns';
import GuestForecastPDF from '../non-rev/pdf/GuestForecastPDF';

const segmentColors = {
  'Corporate': 'primary',
  'Leisure': 'success',
  'Group': 'warning',
  'VIP': 'error',
  'Other': 'default'
};

const GuestForecastReport = () => {
  const { user } = useAuth();
  const [reportDate, setReportDate] = useState(new Date());
  const [daysToForecast, setDaysToForecast] = useState(3);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReportData(null);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await api.post('/generate-guest-forecast', {
        report_date: format(reportDate, 'yyyy-MM-dd'),
        days: daysToForecast
      });

      if (response.data.success && response.data.forecast) {
        setReportData({
          reportDate: format(reportDate, 'yyyy-MM-dd'),
          forecastDays: daysToForecast,
          user,
          forecastData: response.data.forecast,
          summary: response.data.summary
        });
        setSuccess('Guest forecast report generated successfully');
      } else {
        setError(response.data.message || 'No forecast data available.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to generate forecast');
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
        Guest Arrival/Departure Forecast
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Forecast Start Date"
                value={reportDate}
                onChange={setReportDate}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    required 
                    helperText="Starting date for forecast"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Days to Forecast"
              value={daysToForecast}
              onChange={(e) => setDaysToForecast(e.target.value)}
              fullWidth
            >
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <MenuItem key={day} value={day}>
                  {day} day{day !== 1 ? 's' : ''}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%'
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
                {loading ? 'Generating...' : 'Generate Forecast'}
              </Button>
            </Box>
          </Grid>

          {reportData && (
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                gap: 2
              }}>
                <PDFDownloadLink
                  document={<GuestForecastPDF data={reportData} />}
                  fileName={`Guest_Forecast_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`}
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
              </Box>
            </Grid>
          )}
        </Grid>
      </form>

      {reportData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Guest Movement Forecast for {reportData.reportDate} to {format(addDays(parseISO(reportData.reportDate), reportData.forecastDays-1), 'yyyy-MM-dd')}
          </Typography>
          
          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                <Typography variant="h6">Total Arrivals</Typography>
                <Typography variant="h4">{reportData.summary.total_arrivals}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff8e1' }}>
                <Typography variant="h6">Total Departures</Typography>
                <Typography variant="h4">{reportData.summary.total_departures}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                <Typography variant="h6">VIP Guests</Typography>
                <Typography variant="h4">{reportData.summary.vip_count}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Daily Breakdown */}
          {reportData.forecastData.map((dayData, dayIndex) => (
            <Box key={dayIndex} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 1, 
                p: 1,
                backgroundColor: '#1976d2',
                color: 'white',
                borderRadius: 1
              }}>
                {dayData.date} - {dayData.day_of_week}
              </Typography>
              
              <Grid container spacing={2}>
                {/* Arrivals */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Arrivals ({dayData.arrivals.length})
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Room</TableCell>
                            <TableCell>Segment</TableCell>
                            <TableCell>Special Requests</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dayData.arrivals.map((arrival, index) => (
                            <TableRow key={`arrival-${index}`}>
                              <TableCell>{arrival.expected_time || 'N/A'}</TableCell>
                              <TableCell>
                                {arrival.guest_name}
                                {arrival.is_vip && (
                                  <Chip label="VIP" color="error" size="small" sx={{ ml: 1 }} />
                                )}
                              </TableCell>
                              <TableCell>{arrival.room_number}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={arrival.segment} 
                                  color={segmentColors[arrival.segment] || 'default'} 
                                  size="small"
                                />
                              </TableCell>
                              <TableCell sx={{ maxWidth: 150 }}>
                                {arrival.special_requests || 'None'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

                {/* Departures */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Departures ({dayData.departures.length})
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Room</TableCell>
                            <TableCell>Check-Out Type</TableCell>
                            <TableCell>Late Checkout</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dayData.departures.map((departure, index) => (
                            <TableRow key={`departure-${index}`}>
                              <TableCell>{departure.expected_time || 'N/A'}</TableCell>
                              <TableCell>
                                {departure.guest_name}
                                {departure.is_vip && (
                                  <Chip label="VIP" color="error" size="small" sx={{ ml: 1 }} />
                                )}
                              </TableCell>
                              <TableCell>{departure.room_number}</TableCell>
                              <TableCell>
                                {departure.checkout_type === 'Early' ? (
                                  <Chip label="Early" color="warning" size="small" />
                                ) : (
                                  <Chip label="On Time" color="success" size="small" />
                                )}
                              </TableCell>
                              <TableCell>
                                {departure.late_checkout_approved ? (
                                  <Chip label={`Until ${departure.late_checkout_time}`} color="info" size="small" />
                                ) : (
                                  'No'
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          ))}
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

export default GuestForecastReport;