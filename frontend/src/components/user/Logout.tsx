import React from "react";
import { Button } from "@mui/material";

const Logout = ({ onLogout }) => {
  return <Button onClick={onLogout}>Logout</Button>;
};

export default Logout;
