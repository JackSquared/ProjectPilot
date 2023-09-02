import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60px",
        backgroundColor: "#333",
        color: "#fff",
      }}
    >
      <Typography variant="body1">ProjectPilot</Typography>
    </Box>
  );
};

export default Footer;
