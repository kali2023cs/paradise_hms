import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Button, Divider,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, FormControl,
  InputLabel, Select, MenuItem, Grid,
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions,
  useMediaQuery, useTheme, CircularProgress,
  Tabs, Tab, Stack, Chip, Fade, Grow,
  Card, CardContent, Avatar, IconButton,
  Alert
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../../../utils/axios';
import UILoader from "../../../common/UILoader";

const AnimatedPaper = motion(Paper);

const CheckoutForm = () => {
  const { checkinId, roomId } = useParams(); 
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [checkinData, setCheckinData] = useState(null);
  const [roomDetails, setRoomDetails] = useState([]);
  const [checkoutTime, setCheckoutTime] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckinData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First verify the room status
        const statusResponse = await api.get(`/isCheckIned/${roomId}`);
        
        if (!statusResponse.data.status) {
          setError(statusResponse.data.message);
          setLoading(false);
          return;
        }

        // If room is properly checked in, fetch details
        const [checkinRes, roomsRes] = await Promise.all([
          api.get(`/checkindetails/${checkinId}`),
          api.get(`/checkinroomdetails/${checkinId}/${roomId}`)
        ]);

        if (checkinRes.data.success && roomsRes.data.success) {
          const guestInfo = checkinRes.data.data.guestInfo;
          const rooms = roomsRes.data.data.roomDetails;

          // Check if any room is already checked out
          const isCheckedOut = rooms.some(room => room.checkout_status === 'checked_out');
          if (isCheckedOut) {
            setError('This room has already been checked out');
            setLoading(false);
            return;
          }

          setCheckinData(guestInfo);
          setRoomDetails(rooms);

          // Calculate invoice items
          const items = rooms.map(room => {
            const nights = calculateNights(
              guestInfo.check_in_datetime,
              checkoutTime
            );
            const roomSubtotal = (parseFloat(room.net_rate) * nights);
            const discountAmount = parseFloat(room.disc_val) || 0;
            const amountAfterDiscount = roomSubtotal - discountAmount;

            return {
              item_type: 'Room',
              description: `Room ${room.room_no} - ${room.room_type_name} (${nights} ${nights > 1 ? 'nights' : 'night'})`,
              quantity: nights,
              unit_price: parseFloat(room.net_rate),
              tax_rate: 12.00,
              discount: discountAmount,
              amount: amountAfterDiscount > 0 ? amountAfterDiscount : 0
            };
          });

          setInvoiceItems(items);
          calculateTotals(items);
        } else {
          setError('Failed to load check-in details');
        }
      } catch (err) {
        console.error('Error fetching check-in data:', err);
        setError(err.response?.data?.message || 'Failed to load check-in data');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckinData();
  }, [checkinId, roomId]);

  const calculateNights = (checkIn, checkOut) => {
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights < 1 ? 1 : nights;
  };

  const calculateTotals = (items) => {
    const subtotalCalc = items.reduce((sum, item) => sum + item.amount, 0);
    const taxesCalc = items.reduce((sum, item) => sum + (item.amount * (item.tax_rate / 100)), 0);
    const totalCalc = subtotalCalc + taxesCalc;

    setSubtotal(subtotalCalc);
    setTaxes(taxesCalc);
    setTotal(totalCalc);
    setPaymentAmount(totalCalc);
  };

  const handleCheckoutSubmit = async () => {
    if (paymentAmount > total) {
      alert('Payment amount cannot be greater than total amount');
      return;
    }

    setIsProcessing(true);
    try {
      const checkoutData = {
        checkin_id: checkinId,
        room_id: roomId,
        actual_checkout_datetime: checkoutTime,
        early_checkout: new Date(checkoutTime) < new Date(checkinData.check_out_datetime),
        late_checkout: new Date(checkoutTime) > new Date(checkinData.check_out_datetime),
        checkout_remarks: remarks,
        payment_method: paymentMethod,
        payment_amount: paymentAmount,
        invoice_items: invoiceItems.map(item => ({
          item_type: item.item_type,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          amount: item.amount
        }))
      };

      const response = await api.post('/checkout', checkoutData);

      if (response.data.success) {
        navigate(`/dashboard/invoices/${response.data.invoice_number}`);
      } else {
        throw new Error(response.data.message || 'Checkout failed');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Checkout failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsProcessing(false);
      setOpenConfirm(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <UILoader />;
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!checkinData) {
    return (
      <Box p={3}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No check-in data found
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, margin: '0 auto' }}>
      <AnimatedPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          boxShadow: 3,
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          mb: 3,
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              Checkout Process
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40
              }}>
                {checkinData.first_name.charAt(0)}{checkinData.last_name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {checkinData.first_name} {checkinData.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reservation #: {checkinData.reservation_number || 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Chip
                label={`Contact: ${checkinData.contact}`}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 1 }}
              />
              <Chip
                label={`Rooms: ${roomDetails.length}`}
                variant="outlined"
                size="small"
                color="primary"
                sx={{ borderRadius: 1 }}
              />
              <Chip
                label={`Check-in: ${format(parseISO(checkinData.check_in_datetime), 'MMM d, yyyy')}`}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 1 }}
              />
            </Stack>
          </Box>
        </Box>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                backgroundColor: theme.palette.primary.main,
              },
              '& .MuiTab-root': {
                minWidth: 0,
                width: '33.33%',
                maxWidth: 'none',
                px: 1,
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '0.875rem',
                py: 1.5
              }
            }}
          >
            <Tab label="Checkout Details" />
            <Tab label="Payment" />
            <Tab label="Invoice" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ minHeight: '250px', mb: 3 }}>
          {/* Tab 1: Checkout Details */}
          <Fade in={activeTab === 0} mountOnEnter unmountOnExit>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ height: '100%', borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Checkout Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Actual Checkout Time"
                        value={checkoutTime}
                        onChange={(newValue) => setCheckoutTime(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>

                  <TextField
                    label="Remarks"
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grow in={activeTab === 0}>
                  <Card elevation={1} sx={{ height: '100%', borderRadius: 2, p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Stay Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Check-in:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {format(parseISO(checkinData.check_in_datetime), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Scheduled Checkout:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {format(parseISO(checkinData.check_out_datetime), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Actual Checkout:</Typography>
                        <Typography variant="body2" fontWeight="medium" color="primary">
                          {format(checkoutTime, 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </Stack>
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Total Nights:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {calculateNights(checkinData.check_in_datetime, checkoutTime)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Rooms:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {roomDetails.length}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </Grow>
              </Grid>
            </Grid>
          </Fade>

          {/* Tab 2: Payment Information */}
          <Fade in={activeTab === 1} mountOnEnter unmountOnExit>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ height: '100%', borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Payment Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      label="Payment Method"
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Debit Card">Debit Card</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Payment Amount"
                    type="number"
                    fullWidth
                    size="small"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: '₹',
                    }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grow in={activeTab === 1}>
                  <Card elevation={1} sx={{ height: '100%', borderRadius: 2, p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Payment Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                        <Typography variant="body2">₹{subtotal.toFixed(2)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Taxes:</Typography>
                        <Typography variant="body2">₹{taxes.toFixed(2)}</Typography>
                      </Stack>
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body1" fontWeight="bold">Total:</Typography>
                        <Typography variant="body1" fontWeight="bold">₹{total.toFixed(2)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Amount Paid:</Typography>
                        <Typography
                          variant="body2"
                          color={paymentAmount < total ? 'error' : 'success.main'}
                          fontWeight="medium"
                        >
                          ₹{paymentAmount.toFixed(2)}
                        </Typography>
                      </Stack>
                      {paymentAmount < total && (
                        <Typography variant="body2" color="error" fontSize="0.75rem">
                          Note: Payment amount is less than total due (Balance: ₹{(total - paymentAmount).toFixed(2)})
                        </Typography>
                      )}
                    </Stack>
                  </Card>
                </Grow>
              </Grid>
            </Grid>
          </Fade>

          {/* Tab 3: Invoice Summary */}
          <Fade in={activeTab === 2} mountOnEnter unmountOnExit>
            <Box sx={{ width: '100%' }}>
              <Card elevation={0} sx={{ borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Invoice Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer
                  sx={{
                    maxHeight: 440,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    '& .MuiTableCell-root': {
                      padding: '8px 12px'
                    }
                  }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Description</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Nights</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Rate</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Discount</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Tax</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoiceItems.map((item, index) => (
                        <TableRow key={index} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">₹{item.unit_price.toFixed(2)}</TableCell>
                          <TableCell align="right">₹{item.discount.toFixed(2)}</TableCell>
                          <TableCell align="right">{item.tax_rate}%</TableCell>
                          <TableCell align="right">₹{item.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ '& td': { borderBottom: 0 } }}>
                        <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>₹{subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { borderBottom: 0 } }}>
                        <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold' }}>Taxes</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>₹{taxes.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow sx={{
                        backgroundColor: theme.palette.grey[50],
                        '& td': {
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          borderBottom: 0
                        }
                      }}>
                        <TableCell colSpan={5} align="right">Total</TableCell>
                        <TableCell align="right">₹{total.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          </Fade>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: 2,
          mt: 2,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Button
            variant="outlined"
            onClick={() => activeTab > 0 ? setActiveTab(activeTab - 1) : navigate(-1)}
            disabled={isProcessing}
            sx={{
              minWidth: 100,
              borderRadius: 2,
              px: 2,
              py: 1
            }}
          >
            {activeTab > 0 ? 'Back' : 'Cancel'}
          </Button>

          {activeTab < 2 ? (
            <Button
              variant="contained"
              onClick={() => setActiveTab(activeTab + 1)}
              sx={{
                minWidth: 100,
                borderRadius: 2,
                px: 2,
                py: 1
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenConfirm(true)}
              disabled={isProcessing}
              sx={{
                minWidth: 160,
                borderRadius: 2,
                px: 2,
                py: 1
              }}
            >
              {isProcessing ? (
                <>
                  <CircularProgress size={18} sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : 'Complete Checkout'}
            </Button>
          )}
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Grow}
          PaperProps={{
            sx: {
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>
            Confirm Checkout
          </DialogTitle>
          <DialogContent sx={{ bgcolor: 'background.paper', pt: 2 }}>
            <DialogContentText>
              Are you sure you want to complete the checkout for {checkinData.first_name} {checkinData.last_name}?
            </DialogContentText>

            {paymentAmount < total && (
              <Paper elevation={0} sx={{
                p: 1.5,
                mt: 2,
                backgroundColor: theme.palette.warning.light,
                borderLeft: `4px solid ${theme.palette.warning.main}`,
                borderRadius: 1
              }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong> The payment amount (₹{paymentAmount.toFixed(2)}) is less than the total due (₹{total.toFixed(2)}).
                  The balance of ₹{(total - paymentAmount).toFixed(2)} will be recorded.
                </Typography>
              </Paper>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: 'background.paper', p: 2 }}>
            <Button
              onClick={() => setOpenConfirm(false)}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 0.5
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckoutSubmit}
              color="primary"
              variant="contained"
              autoFocus
              sx={{
                borderRadius: 2,
                px: 2,
                py: 0.5
              }}
            >
              Confirm Checkout
            </Button>
          </DialogActions>
        </Dialog>
      </AnimatedPaper>
    </Box>
  );
};

export default CheckoutForm;