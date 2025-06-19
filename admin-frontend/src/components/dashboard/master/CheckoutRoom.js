import React from "react";
import { Container, Box } from "@mui/material";
import CheckoutForm from "./forms/CheckoutForm";

const CheckoutRoom = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column", // Stack vertically
          alignItems: "center",
          justifyContent: "flex-start", // Align from top
        }}
      >
        <CheckoutForm />
      </Box>
    </Container>
  );
};

export default CheckoutRoom;
