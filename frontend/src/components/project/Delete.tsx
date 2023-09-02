import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const DeleteProject = ({ project, onDelete, onClose }) => {
  const handleDelete = () => {
    onDelete(project.id);
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {project.name}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="primary">
          Yes, delete
        </Button>
        <Button onClick={onClose} color="primary" autoFocus>
          No, cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProject;
