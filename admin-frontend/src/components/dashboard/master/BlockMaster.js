
import React from "react";
import { Container, Box } from "@mui/material";
import BlockMasterTable from "./tables/BlockMasterTable";

const BlockMaster = () => {
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
        <BlockMasterTable />
      </Box>
    </Container>
  );
};

export default BlockMaster;
