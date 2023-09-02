import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";

const Edit = ({ project }) => {
  const initialValues = {
    name: project.name,
    description: project.description,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Project name is required"),
    description: Yup.string().required("Project description is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <TextField
            name="name"
            label="Project Name"
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name ? String(errors.name) : ""}
          />
          <TextField
            name="description"
            label="Project Description"
            error={touched.description && Boolean(errors.description)}
            helperText={
              touched.description && errors.description
                ? String(errors.description)
                : ""
            }
          />
          <Button type="submit">Update Project</Button>
        </Form>
      )}
    </Formik>
  );
};

export default Edit;
