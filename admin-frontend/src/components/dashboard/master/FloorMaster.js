
import React from "react";
import { Container, Box } from "@mui/material";
import FloorMasterTable from "./tables/FloorMasterTable";

const FloorMaster = () => {
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
        <FloorMasterTable />
      </Box>
    </Container>
  );
};

export default FloorMaster;
