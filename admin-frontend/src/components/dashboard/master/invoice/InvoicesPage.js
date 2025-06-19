import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Paper, Typography, Button, Divider, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Tab, Tabs, TextField,
  useMediaQuery, useTheme, CircularProgress, Alert,
  Fade, Grow, Slide, Zoom, styled, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton,
  Grid, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { pdf } from '@react-pdf/renderer';
import api from '../../../../utils/axios';
import { format, parseISO } from 'date-fns';
import InvoicePDF from '../invoice/InvoicePDF';
import UILoader from "../../../common/UILoader";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.12)'
  }
}));

const StatusBadge = styled(Box)(({ status, theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  display: 'inline-block',
  backgroundColor: 
    status === 'Paid' ? theme.palette.success.light :
    status === 'Pending' ? theme.palette.warning.light :
    theme.palette.error.light,
  color: theme.palette.common.white,
  transition: 'all 0.2s ease'
}));

const ActionButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}));

const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.01)'
  }
}));

const InvoiceDetailsModal = ({ invoice, open, onClose, onDownload }) => {
  if (!invoice) return null;

  const checkout = invoice.checkout || {};
  const checkin = checkout.checkin || {};
  const items = Array.isArray(invoice.items) ? invoice.items : [];
  
  // Calculate totals
  const subtotal = parseFloat(invoice.subtotal) || 
                  items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  
  const taxAmount = parseFloat(invoice.tax_amount) || 
                  items.reduce((sum, item) => {
                    return sum + (parseFloat(item.amount || 0) * (parseFloat(item.tax_rate || 0) / 100));
                  }, 0);
  
  const discountAmount = parseFloat(invoice.discount_amount) || 
                       parseFloat(checkout.discount_amount || 0);
  
  const total = parseFloat(invoice.total_amount) || 
               (subtotal + taxAmount - discountAmount);
  
  const amountPaid = parseFloat(invoice.amount_paid) || 
                    parseFloat(checkout.amount_paid || 0);
  
  const balanceDue = parseFloat(invoice.balance_due) || 
                    parseFloat(checkout.balance_due || 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Grow}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          Invoice Details - #{invoice.invoice_number}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          {/* Header Section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Hotel Information
                </Typography>
                <Typography variant="body2">Grand Plaza Hotel</Typography>
                <Typography variant="body2">123 Luxury Avenue, Mumbai</Typography>
                <Typography variant="body2">GSTIN: 27ABCDE1234F1Z5</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Guest Information
                </Typography>
                <Typography variant="body2">
                  {[checkin.title, checkin.first_name, checkin.last_name].filter(Boolean).join(' ') || 'Guest'}
                </Typography>
                <Typography variant="body2">
                  {checkin.address || 'No address provided'}
                </Typography>
                {checkin.gst_number && (
                  <Typography variant="body2">GSTIN: {checkin.gst_number}</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Invoice Details */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">Invoice Number</Typography>
              <Typography>{invoice.invoice_number || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">Booking Reference</Typography>
              <Typography>{checkin.reservation_number || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">Invoice Date</Typography>
              <Typography>
                {invoice.invoice_date ? format(parseISO(invoice.invoice_date), 'dd MMM yyyy') : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">Due Date</Typography>
              <Typography>
                {invoice.due_date ? format(parseISO(invoice.due_date), 'dd MMM yyyy') : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">Status</Typography>
              <Chip 
                label={invoice.status || 'Unknown'}
                color={
                  invoice.status === 'Paid' ? 'success' :
                  invoice.status === 'Pending' ? 'warning' : 'error'
                }
                size="small"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Items Table */}
          <Typography variant="h6" gutterBottom>Invoice Items</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="right">Tax %</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description || 'Service'}</TableCell>
                      <TableCell align="right">{item.quantity || 1}</TableCell>
                      <TableCell align="right">{parseFloat(item.unit_price || 0).toFixed(2)}</TableCell>
                      <TableCell align="right">{parseFloat(item.tax_rate || 0).toFixed(2)}%</TableCell>
                      <TableCell align="right">{parseFloat(item.amount || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No items found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals Section */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Box sx={{ width: 300 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>₹{subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>₹{taxAmount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Discount:</Typography>
                <Typography color="error">-₹{discountAmount.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Amount Paid:</Typography>
                <Typography color="success.main">₹{amountPaid.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight="bold">Balance Due:</Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="error">
                  ₹{balanceDue.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Payment Details */}
          {Array.isArray(checkout.payments) && checkout.payments.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>Payment Details</Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Reference</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {checkout.payments.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {payment.payment_date ? format(parseISO(payment.payment_date), 'dd MMM yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>{payment.payment_method || 'N/A'}</TableCell>
                        <TableCell align="right">
                          ₹{parseFloat(payment.payment_amount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>{payment.reference_number || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="primary"
          variant="outlined"
        >
          Close
        </Button>
        <Button 
          onClick={() => onDownload(invoice)}
          color="primary"
          variant="contained"
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const InvoicesPage = () => {
  const { invoiceNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tabs = [
    { label: 'All', filter: () => true },
    { label: 'Paid', filter: (invoice) => invoice.status === 'Paid' },
    { label: 'Pending', filter: (invoice) => invoice.status === 'Pending' },
    { label: 'Overdue', filter: (invoice) => invoice.status === 'Overdue' }
  ];

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (invoiceNumber) {
          const response = await api.get(`/invoices/${invoiceNumber}`);
          
          if (response.data.success) {
            setSelectedInvoice(response.data.data);
            setInvoices([response.data.data]);
            setFilteredInvoices([response.data.data]);
            setOpenModal(true);
          } else {
            throw new Error(response.data.message || 'Invoice not found');
          }
        } else {
          const response = await api.get('/invoices');
          
          if (response.data.success) {
            const invoiceData = Array.isArray(response.data.data?.data) 
              ? response.data.data.data 
              : [];
            setInvoices(invoiceData);
            setFilteredInvoices(invoiceData);
          } else {
            throw new Error(response.data.message || 'Failed to fetch invoices');
          }
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError(err.message || 'Failed to load invoices');
        setInvoices([]);
        setFilteredInvoices([]);
        setSelectedInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [invoiceNumber]);

  useEffect(() => {
    try {
      let result = Array.isArray(invoices) ? [...invoices] : [];
      
      if (tabValue < tabs.length) {
        result = result.filter(tabs[tabValue].filter);
      }
      
      if (startDate && endDate) {
        result = result.filter(invoice => {
          try {
            const invoiceDate = parseISO(invoice.invoice_date);
            return invoiceDate >= startDate && invoiceDate <= endDate;
          } catch (e) {
            console.error('Error parsing invoice date:', e);
            return false;
          }
        });
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(invoice => {
          try {
            return (
              (invoice.invoice_number && invoice.invoice_number.toString().toLowerCase().includes(query)) ||
              (invoice.checkout?.checkin?.reservation_number && invoice.checkout.checkin.reservation_number.toString().toLowerCase().includes(query)) ||
              (invoice.checkout_id && invoice.checkout_id.toString().includes(query))
            );
          } catch (e) {
            console.error('Error filtering invoice:', e);
            return false;
          }
        });
      }
      
      setFilteredInvoices(result);
    } catch (err) {
      console.error('Error applying filters:', err);
      setFilteredInvoices([]);
    }
  }, [tabValue, invoices, startDate, endDate, searchQuery]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedInvoice(null);
    if (invoiceNumber) {
      navigate('/dashboard/invoices');
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      const response = await api.get(`/invoices/generate-pdf/${invoice.invoice_number}`);
      
      if (response.data.success) {
        const invoiceData = response.data.data;
        
        const blob = await pdf(
          <InvoicePDF invoiceData={invoiceData} />
        ).toBlob();
        
        downloadBlob(blob, `invoice-${invoice.invoice_number}.pdf`);
      } else {
        throw new Error(response.data.message || 'Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate invoice PDF');
    }
  };

  if (loading) {
    return (
      <Fade in={true}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <UILoader />
        </Box>
      </Fade>
    );
  }

  if (error) {
    return (
      <Slide direction="up" in={true}>
        <Box p={3}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ 
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
          >
            Retry
          </Button>
        </Box>
      </Slide>
    );
  }

  return (
    <StyledPaper>
      <Grow in={true}>
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="600" color="text.primary">
              Invoices Management
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  height: '3px',
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab 
                  key={index} 
                  label={`${tab.label} (${
                    Array.isArray(invoices) ? invoices.filter(tab.filter).length : 0
                  })`}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    minWidth: 'unset',
                    padding: '12px 16px',
                    '&.Mui-selected': {
                      color: theme.palette.primary.main
                    }
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Filter Controls */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              my: 3,
              padding: '16px',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '8px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    size="small" 
                    sx={{ 
                      minWidth: isMobile ? '100%' : '180px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  />
                )}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    size="small" 
                    sx={{ 
                      minWidth: isMobile ? '100%' : '180px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            
            <TextField
              label="Search Invoices"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ 
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ marginRight: '8px', color: theme.palette.action.active }}>
                    <i className="fas fa-search"></i>
                  </Box>
                )
              }}
            />
          </Box>

          {/* Invoice Table */}
          <TableContainer 
            component={Paper}
            sx={{
              borderRadius: '8px',
              boxShadow: 'none',
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                  <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reservation #</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice, index) => (
                    <Zoom 
                      in={true} 
                      key={invoice.invoice_number || invoice.id}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <AnimatedTableRow>
                        <TableCell>{invoice.invoice_number || 'N/A'}</TableCell>
                        <TableCell>{invoice.checkout?.checkin?.reservation_number || 'N/A'}</TableCell>
                        <TableCell>
                          {invoice.invoice_date ? format(parseISO(invoice.invoice_date), 'dd MMM yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {invoice.due_date ? format(parseISO(invoice.due_date), 'dd MMM yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          ₹{parseFloat(invoice.checkout?.grand_total || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status}>
                            {invoice.status || 'Unknown'}
                          </StatusBadge>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <ActionButton 
                              size="small" 
                              variant="outlined"
                              onClick={() => handleViewInvoice(invoice)}
                              disabled={!invoice.invoice_number}
                              sx={{
                                borderRadius: '6px',
                                textTransform: 'none'
                              }}
                            >
                              View
                            </ActionButton>
                            <ActionButton 
                              size="small" 
                              variant="contained"
                              onClick={() => handleDownloadInvoice(invoice)}
                              disabled={!invoice.invoice_number}
                              sx={{
                                borderRadius: '6px',
                                textTransform: 'none',
                                boxShadow: 'none',
                                '&:hover': {
                                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
                                }
                              }}
                            >
                              Download
                            </ActionButton>
                          </Box>
                        </TableCell>
                      </AnimatedTableRow>
                    </Zoom>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <img 
                          src="/src/assets/no-data.svg" 
                          alt="No invoices found" 
                          style={{ width: '120px', opacity: 0.7, marginBottom: '16px' }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          No invoices match your criteria
                        </Typography>
                        <Button 
                          variant="text" 
                          color="primary" 
                          onClick={() => {
                            setStartDate(null);
                            setEndDate(null);
                            setSearchQuery('');
                            setTabValue(0);
                          }}
                          sx={{ mt: 1 }}
                        >
                          Clear filters
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Invoice Details Modal */}
          <InvoiceDetailsModal
            invoice={selectedInvoice}
            open={openModal}
            onClose={handleCloseModal}
            onDownload={handleDownloadInvoice}
          />
        </Box>
      </Grow>
    </StyledPaper>
  );
};

export default InvoicesPage;