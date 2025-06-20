import React, { useState } from 'react';
import api from '../../../../src/utils/axios';
import { useAuth } from '../../../utils/AuthContext';
import {
  Paper,
  Typography,
  Box,
  FormControlLabel,
  FormLabel,
  FormControl,
  Button,
  Grid,
  Alert,
  Snackbar,
  Checkbox,
  FormGroup
} from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import UILoader from '../../common/UILoader';
import RoomsReportPDF from '../non-rev/pdf/RoomsReportPDF';

const statusOptions = [
  'Available',
  'Occupied',
  'Maintenance',
  'Cleaning',
  'Dirty',
  'Out of Order',
  'Blocked'
];

const RoomsReport = () => {
  const { user } = useAuth();
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setSelectedStatuses(
      selectedStatuses.includes(value)
        ? selectedStatuses.filter(status => status !== value)
        : [...selectedStatuses, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReportData(null);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await api.post('/generate-rooms-report', {
        statuses: selectedStatuses,
        includeInactive
      });

      if (response.data.success && response.data.records) {
        setReportData({
          user,
          reportData: response.data.records,
          summary: response.data.summary || null
        });
        setSuccess('Rooms report generated successfully');
      } else {
        setError(response.data.message || 'No room data found for the selected criteria.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to generate rooms report');
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
      maxWidth: 1000,
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
        Rooms Report Generator
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
                Filter by Room Status
              </FormLabel>
              <FormGroup row>
                {statusOptions.map((status) => (
                  <FormControlLabel
                    key={status}
                    control={
                      <Checkbox 
                        checked={selectedStatuses.includes(status)}
                        onChange={handleStatusChange}
                        value={status}
                        color="primary"
                      />
                    }
                    label={status}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeInactive}
                  onChange={(e) => setIncludeInactive(e.target.checked)}
                  color="primary"
                />
              }
              label="Include Inactive Rooms"
            />
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
                  document={<RoomsReportPDF data={reportData} />}
                  fileName={`Rooms_Report_${new Date().toISOString().slice(0, 10)}.pdf`}
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

export default RoomsReport;