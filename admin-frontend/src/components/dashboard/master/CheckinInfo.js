import React, { useEffect, useState, useRef } from "react";
import { 
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Payment as PaymentIcon,
  MeetingRoom as RoomIcon,
  Wifi as WifiIcon,
  LocalParking as ParkingIcon,
  Restaurant as RestaurantIcon,
  Pool as PoolIcon,
  CreditCard as CreditCardIcon,
  Star as StarIcon,
  Assignment as DocumentIcon,
  AccountBalanceWallet as WalletIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  ExitToApp as CheckOutIcon
} from "@mui/icons-material";
import api from '../../../../src/utils/axios';
import { useLocation, useNavigate } from "react-router-dom";
import UILoader from "../../common/UILoader";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const CheckinInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pdfRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checkInData, setCheckInData] = useState(null);
  const [error, setError] = useState(null);

  const preSelectedRoom = location.state?.preSelectedRoom || {};

  useEffect(() => {
    if (preSelectedRoom.roomId && preSelectedRoom.checkinId) {
      fetchCheckInInfo(preSelectedRoom.roomId, preSelectedRoom.checkinId);
    } else {
      setError('No room selection data provided');
      setLoading(false);
    }
  }, [preSelectedRoom]);

  const fetchCheckInInfo = async (roomId, checkinId) => {
    try {
      const response = await api.get('/checkin-info', {
        params: { 
          room_id: roomId, 
          checkin_id: checkinId 
        }
      });
      
      if (response.data.success) {
        setCheckInData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch check-in information');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch check-in information');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return "N/A";
    const diff = (new Date(checkOutDate) - new Date(checkInDate));
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} night${days !== 1 ? 's' : ''}`;
  };

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, {
      scale: 2,
      logging: true,
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`checkin_details_${checkInData?.checkin_master?.reservation_number || ''}.pdf`);
    });
  };

  const handleCheckOut = () => {
    if (preSelectedRoom.roomId && preSelectedRoom.checkinId) {
      navigate(`/dashboard/checkout-room/${preSelectedRoom.checkinId}/${preSelectedRoom.roomId}`);
    }
  };

  if (loading) return <UILoader />;
  if (error) return <div>Error: {error}</div>;
  if (!checkInData) return <div>No check-in data available</div>;

  // Extract data from the response
  const checkinMaster = checkInData.checkin_master || {};
  const roomTransaction = checkInData.room_transaction || {};
  const room = checkInData.room || {};
  
  // Destructure the data
  const {
    is_reservation,
    reservation_number,
    mode_name,
    ota,
    booking_id,
    contact,
    title_name,
    first_name,
    last_name,
    gendername,
    city,
    id_number,
    email,
    check_in_mode,
    foreign_guest,
    segment_id,
    business_source_id,
    photo,
    document,
    gst_number,
    guest_company,
    age,
    gst_type,
    address,
    visit_remark,
    pin_code,
    nationality,
    booking_instructions,
    guest_special_instructions,
    is_vip,
    check_in_type,
    check_in_datetime,
    number_of_days,
    check_out_datetime,
    grace_hours,
    payment_by,
    allow_charges_posting,
    enable_paxwise,
    enable_room_sharing,
  } = checkinMaster;
  
  const {
    room_type_name,
    room_no,
    plan_name,
    guest_name,
    male,
    female,
    extra,
    net_rate,
    disc_type,
    disc_val,
    total,
  } = roomTransaction;

  // Room amenities
  const roomAmenities = [
    { name: "WiFi", icon: <WifiIcon fontSize="small" />, available: room?.wifi },
    { name: "Parking", icon: <ParkingIcon fontSize="small" />, available: room?.parking },
    { name: "Breakfast", icon: <RestaurantIcon fontSize="small" />, available: room?.breakfast_included },
    { name: "Pool", icon: <PoolIcon fontSize="small" />, available: room?.pool_access },
  ].filter((amenity) => amenity.available);

  // Services (example - adjust based on your actual data)
  const services = checkInData.services || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} ref={pdfRef}>
      <Box sx={{ width: "100%" }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Check-In Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {is_vip && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: 'warning.light',
                px: 2,
                py: 1,
                borderRadius: 1
              }}>
                <StarIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>VIP Guest</Typography>
              </Box>
            )}
            <Typography variant="subtitle1" sx={{ 
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              px: 2,
              py: 1,
              borderRadius: 1,
              fontWeight: 600
            }}>
              #{reservation_number}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Guest Information Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              height: '100%', 
              borderRadius: 2,
              borderLeft: '4px solid',
              borderColor: 'primary.main'
            }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Guest Information</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={photo} 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 3,
                      border: '2px solid',
                      borderColor: 'primary.main'
                    }}
                  >
                    {!photo && <PersonIcon fontSize="large" />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {title_name} {first_name} {last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {guest_name}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Contact Number</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{contact || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Email</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{email || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Gender</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{gendername || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Age</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{age || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>ID Number</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{id_number || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Nationality</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{nationality || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Address</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {address ? `${address}, ${city}, ${pin_code}` : "N/A"}
                  </Typography>
                </Grid>

                {guest_company && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <BusinessIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Company</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{guest_company}</Typography>
                  </Grid>
                )}

                {gst_number && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <WorkIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>GST Information</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {gst_number} ({gst_type})
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Booking & Payment Information Section */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              {/* Booking Information */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  borderLeft: '4px solid',
                  borderColor: 'secondary.main'
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Booking Information</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Reservation Number</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{reservation_number || "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Booking ID</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{booking_id || "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Check-In</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{formatDate(check_in_datetime)}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Check-Out</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{formatDate(check_out_datetime)}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Duration</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{calculateDuration(check_in_datetime, check_out_datetime)}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Grace Hours</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{grace_hours || "0"} hours</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Arrival Mode</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{mode_name || "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Check-In Type</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{check_in_type || "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Foreign Guest</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{foreign_guest ? "Yes" : "No"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>OTA</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{ota || "Direct Booking"}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Payment Information */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  borderLeft: '4px solid',
                  borderColor: 'success.main'
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PaymentIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Payment Information</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Rate Plan</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{plan_name || "Standard"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Payment Method</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{payment_by || "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Net Rate</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>₹{net_rate || "0.00"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Discount</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {disc_type === 'percentage' ? `${disc_val}%` : disc_val ? `₹${disc_val}` : "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Total Amount</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>₹{total || "0.00"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Allow Charges Posting</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{allow_charges_posting ? "Yes" : "No"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Paxwise Enabled</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{enable_paxwise ? "Yes" : "No"}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Room Information Section */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              borderRadius: 2,
              borderLeft: '4px solid',
              borderColor: 'info.main'
            }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <RoomIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Room Information</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    textAlign: "center",
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper'
                  }}>
                    <Avatar
                      src={room?.image}
                      alt={room?.type}
                      sx={{ 
                        width: 160, 
                        height: 160, 
                        mx: "auto", 
                        mb: 2,
                        border: '2px solid',
                        borderColor: 'primary.main'
                      }}
                    >
                      <RoomIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{room_type_name || "Room Type"}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">Room #{room_no || "N/A"}</Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 700 }}>
                      ₹{net_rate || "0.00"} / night
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Occupancy</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {male || 0} Male, {female || 0} Female, {extra || 0} Extra
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Room Sharing</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {enable_room_sharing ? "Enabled" : "Disabled"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Description</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {room?.description || "No description available"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Amenities</Typography>
                      <Box sx={{ 
                        display: "flex", 
                        flexWrap: "wrap", 
                        gap: 1, 
                        mb: 2,
                        '& > *': {
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          px: 1.5,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'background.default'
                        }
                      }}>
                        {roomAmenities.length > 0 ? (
                          roomAmenities.map((amenity, index) => (
                            <Box key={index}>
                              {amenity.icon}
                              <Typography variant="body2" sx={{ ml: 0.5 }}>{amenity.name}</Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2">No amenities listed</Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Guest Instructions */}
                  <Grid container spacing={2}>
                    {guest_special_instructions && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Special Instructions</Typography>
                        <Typography variant="body1" sx={{ 
                          whiteSpace: 'pre-line',
                          p: 1.5,
                          backgroundColor: 'action.hover',
                          borderRadius: 1,
                          fontWeight: 500
                        }}>
                          {guest_special_instructions}
                        </Typography>
                      </Grid>
                    )}

                    {booking_instructions && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Booking Instructions</Typography>
                        <Typography variant="body1" sx={{ 
                          whiteSpace: 'pre-line',
                          p: 1.5,
                          backgroundColor: 'action.hover',
                          borderRadius: 1,
                          fontWeight: 500
                        }}>
                          {booking_instructions}
                        </Typography>
                      </Grid>
                    )}

                    {visit_remark && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Visit Remarks</Typography>
                        <Typography variant="body1" sx={{ 
                          whiteSpace: 'pre-line',
                          p: 1.5,
                          backgroundColor: 'action.hover',
                          borderRadius: 1,
                          fontWeight: 500
                        }}>
                          {visit_remark}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Documents Section */}
          {document && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'warning.main'
              }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <DocumentIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Guest Documents</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Button
                  variant="outlined"
                  href={document}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<DocumentIcon />}
                  sx={{ 
                    textTransform: 'none',
                    px: 3,
                    py: 1
                  }}
                >
                  View Uploaded Document
                </Button>
              </Paper>
            </Grid>
          )}

          {/* Services Section */}
          {services.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'error.main'
              }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <WalletIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Additional Services</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {services.map((service, index) => (
                        <TableRow key={index} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{service.name}</TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>{service.description || "N/A"}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500 }}>₹{service.price}</TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>{service.frequency || "One-time"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          )}

          {/* Actions Section */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<PrintIcon />}
                onClick={downloadPDF}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Print Details
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<EditIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Modify Booking
              </Button>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<CheckOutIcon />}
                onClick={handleCheckOut}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Check Out
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CheckinInfo;