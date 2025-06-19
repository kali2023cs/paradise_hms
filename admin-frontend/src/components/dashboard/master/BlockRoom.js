import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import api from "../../../utils/axios";
import UILoader from "../../../components/common/UILoader";

const BlockRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const location = useLocation();


  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/retriveRoomMasterForBlock");
      if (res.data.status) {
        setRooms(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    }, []);

    useEffect(() => {
    if (rooms.length > 0 && location.state?.preSelectedRoom?.roomId) {
        setRoomId(location.state.preSelectedRoom.roomId.toString());
    }
    }, [rooms, location.state]);


  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
        room_id: roomId,
        reason,
        from_date: fromDate,
        to_date: toDate,
    };

    try {
        const res = await api.post("/blockRoom", formData);

        if (res.data.status) {
        setSnackbarMessage(res.data.message || "Room blocked successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Reset form
        setRoomId("");
        setReason("");
        setFromDate(null);
        setToDate(null);

        // Refetch rooms after successful block
        await fetchRooms();
        } else {
        setSnackbarMessage(res.data.message || "Failed to block room");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        }
    } catch (err) {
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Error submitting form:", err);
    } finally {
        setLoading(false);
    }
    };

  return (
    <Container maxWidth="sm">
      {loading ? (
        <UILoader />
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 4,
            p: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 2,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h6">Block Room</Typography>

          <TextField
            select
            label="Room No"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.room_no}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              renderInput={(params) => <TextField {...params} required />}
            />
            <DateTimePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              renderInput={(params) => <TextField {...params} required />}
            />
          </LocalizationProvider>

          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlockRoom;
