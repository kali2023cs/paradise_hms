import React from "react";
import { Container, Box } from "@mui/material";
import CheckinListIndex from "./list/CheckinListIndex";

const CheckinList = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 4,
          mb: 4,
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column", // Stack vertically
          alignItems: "center",
          justifyContent: "flex-start", // Align from top
        }}
      >
        <CheckinListIndex />
      </Box>
    </Container>
  );
};

export default CheckinList;
