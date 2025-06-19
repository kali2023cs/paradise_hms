
import React from "react";
import { Container, Box } from "@mui/material";
import RoomMasterTable from "./tables/RoomMasterTable";

const RoomMaster = () => {
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
        <RoomMasterTable />
      </Box>
    </Container>
  );
};

export default RoomMaster;
