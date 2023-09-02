import React from "react";
import { Typography } from "@mui/material";

const Profile = ({ user }) => {
  return (
    <div>
      <Typography variant="h4">Welcome, {user.username}!</Typography>
      <Typography>Email: {user.email}</Typography>
    </div>
  );
};

export default Profile;
