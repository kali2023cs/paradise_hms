import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import api from "../../../utils/axios";
import UILoader from "../../../components/common/UILoader";

const UnblockRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const location = useLocation();

  const fetchBlockedRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/retriveBlockedRooms");
      if (res.data.status) {
        setRooms(res.data.data);

        // Set pre-selected room if available
        const preRoomId = location.state?.preSelectedRoom?.roomId;
        if (preRoomId) {
          setRoomId(preRoomId.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching blocked rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedRooms();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/unblockRoom", { room_id: roomId });

      if (res.data.status) {
        setSnackbarMessage(res.data.message || "Room unblocked successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setRoomId("");
        await fetchBlockedRooms();
      } else {
        setSnackbarMessage(res.data.message || "Failed to unblock room");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error unblocking room:", err);
      setSnackbarMessage("Something went wrong. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
          <Typography variant="h6">Unblock Room</Typography>

          <TextField
            select
            label="Select Blocked Room"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          >
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.room_no}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No blocked rooms available</MenuItem>
            )}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!roomId}
          >
            Unblock
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

export default UnblockRoom;
