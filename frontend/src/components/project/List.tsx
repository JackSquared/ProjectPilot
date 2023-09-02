import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { List as MUIList, ListItem, ListItemText, Button } from "@mui/material";

const ProjectList = ({ projects }) => {
  return (
    <div>
      <h1>Your Projects</h1>
      <MUIList>
        {projects.map((project) => (
          <ListItem key={project.id}>
            <ListItemText
              primary={
                <RouterLink to={`/projects/${project.id}`}>
                  {project.name}
                </RouterLink>
              }
            />
          </ListItem>
        ))}
      </MUIList>
      <Button component={RouterLink} to="/projects/new">
        Create a New Project
      </Button>
    </div>
  );
};

export default ProjectList;
