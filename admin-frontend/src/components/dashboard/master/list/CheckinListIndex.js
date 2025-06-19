import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Edit,
  Delete,
  MeetingRoom,
  Person,
  CheckCircle,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import api from "../../../../utils/axios";

const CheckinListIndex = () => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        const response = await api.get("/checkinList");
        setCheckins(response.data.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCheckins();
  }, []);

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleEdit = (checkin) => {
    const formData = {
      isReservation: checkin.is_reservation || false,
      reservationNumber: checkin.reservation_number || "",
      arrivalMode: checkin.arrival_mode || "",
      ota: checkin.ota || "",
      bookingId: checkin.booking_id || "",
      contact: checkin.contact || "",
      title: checkin.title || "",
      firstName: checkin.first_name || "",
      lastName: checkin.last_name || "",
      gender: checkin.gender || "",
      city: checkin.city || "",
      idNumber: checkin.id_number || "",
      email: checkin.email || "",
      checkInMode: checkin.check_in_mode || "Day",
      allowCredit: checkin.allow_credit || "No",
      foreignGuest: checkin.foreign_guest || "No",
      segment: checkin.segment || "",
      businessSource: checkin.business_source || "",
      photo: checkin.photo || null,
      document: checkin.document || null,
      gstNumber: checkin.gst_number || "",
      guestCompany: checkin.guest_company || "",
      age: checkin.age || "",
      gstType: checkin.gst_type || "UNREGISTERED",
      address: checkin.address || "",
      visitRemark: checkin.visit_remark || "",
      pinCode: checkin.pin_code || "",
      nationality: checkin.nationality || "Indian",
      bookingInstructions: checkin.booking_instructions || "",
      guestSpecialInstructions: checkin.guest_special_instructions || "",
      isVIP: checkin.is_vip || false,
      checkInType: checkin.check_in_type || "24 Hours CheckIn",
      checkInDateTime: new Date(checkin.check_in_datetime),
      numberOfDays: checkin.number_of_days || 1,
      checkOutDateTime: new Date(checkin.check_out_datetime),
      graceHours: checkin.grace_hours || 2,
      paymentBy: checkin.payment_by || "Direct",
      allowChargesPosting: checkin.allow_charges_posting || false,
      enablePaxwise: checkin.enable_paxwise || false,
      enableRoomSharing: checkin.enable_room_sharing || false,
    };

    const roomDetails = checkin.rooms.map((room) => ({
      roomType: room.room_type_name || "",
      roomTypeId: room.room_type_id || "",
      roomNo: room.room_no || "",
      roomId: room.room_id || "",
      ratePlan: room.rate_plan_name || "",
      ratePlanId: room.rate_plan_id || "",
      mealPlan: room.meal_plan || "",
      guestName: room.guest_name || "",
      contact: room.contact || "",
      male: room.male || 0,
      female: room.female || 0,
      extra: room.extra || 0,
      netRate: room.net_rate || "",
      discType: room.disc_type || "No Disc",
      discVal: room.disc_val || "",
      total: room.total || 0,
      maxPax: room.max_pax || 0,
      maxExtraPax: room.max_extra_pax || 0,
    }));

    navigate("/dashboard/check-in-room", {
      state: {
        formData,
        roomDetails,
        isEditMode: true,
        checkinId: checkin.id,
      },
    });
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Guest Check-ins
      </Typography>
      <Paper elevation={2}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Guest</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Rooms</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkins.map((checkin) => (
                <React.Fragment key={checkin.id}>
                  <TableRow hover>
                    <TableCell>{checkin.id}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Person sx={{ mr: 1, fontSize: 18 }} />
                        {checkin.first_name} {checkin.last_name}
                      </Box>
                    </TableCell>
                    <TableCell>{checkin.contact}</TableCell>
                    <TableCell>
                      {new Date(checkin.check_in_datetime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(checkin.check_out_datetime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <MeetingRoom sx={{ mr: 1, fontSize: 18 }} />
                        {checkin.rooms.length}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" color="success.main">
                        <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                        Checked In
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => toggleRowExpand(checkin.id)}>
                        {expandedRows.includes(checkin.id) ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                      <IconButton color="primary" onClick={() => handleEdit(checkin)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                      <Collapse in={expandedRows.includes(checkin.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Room Details
                          </Typography>
                          <Divider />
                          <Table size="small" sx={{ mt: 1 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Room #</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Guest Name</TableCell>
                                <TableCell>Rate Plan</TableCell>
                                <TableCell>Guests</TableCell>
                                <TableCell>Total</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {checkin.rooms.map((room, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{room.room_id}</TableCell>
                                  <TableCell>{room.room_type_id}</TableCell>
                                  <TableCell>{room.guest_name}</TableCell>
                                  <TableCell>{room.rate_plan_id}</TableCell>
                                  <TableCell>
                                    {room.male}M / {room.female}F{" "}
                                    {room.extra > 0 ? `+${room.extra}` : ""}
                                  </TableCell>
                                  <TableCell>₹{room.total}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default CheckinListIndex;
