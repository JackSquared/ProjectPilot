import React from 'react';
import { Link } from 'react-router-dom';

const List = ({ projects }) => {
  return (
    <div>
      <h1>Your Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
      <Link to='/projects/new'>Create a New Project</Link>
    </div>
  );
};

export default List;
