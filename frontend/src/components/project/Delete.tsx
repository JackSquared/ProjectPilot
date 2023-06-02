import React from 'react';

const DeleteProject = ({ project, onDelete, onClose }) => {
  const handleDelete = () => {
    onDelete(project.id);
  };

  return (
    <div>
      <p>Are you sure you want to delete {project.name}?</p>
      <button onClick={handleDelete}>Yes, delete</button>
      <button onClick={onClose}>No, cancel</button>
    </div>
  );
};

export default DeleteProject;
