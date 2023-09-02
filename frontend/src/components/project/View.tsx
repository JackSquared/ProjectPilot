import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";

const View = ({ project, onDelete }) => {
  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <Button component={RouterLink} to={`/projects/${project.id}/edit`}>
        Edit
      </Button>
      <Button onClick={() => onDelete(project.id)}>Delete</Button>
    </div>
  );
};

export default View;
