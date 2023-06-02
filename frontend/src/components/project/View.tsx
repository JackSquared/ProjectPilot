import React from 'react';
import { Link } from 'react-router-dom';

const View = ({ project, onDelete }) => {
  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <Link to={`/projects/${project.id}/edit`}>Edit</Link>
      <button onClick={() => onDelete(project.id)}>Delete</button>
    </div>
  );
};

export default View;
