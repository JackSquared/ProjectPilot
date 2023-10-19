import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box } from "@mui/material";

interface LoginProps {
  onAuth: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onAuth }) => {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log(values);
    onAuth(values.email, values.password);
    setSubmitting(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
      bgcolor="#f2f2f2"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <TextField
              name="email"
              label="Email"
              type="email"
              error={touched.email && Boolean(errors.email)}
              helperText={
                touched.email && errors.email ? String(errors.email) : ""
              }
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              error={touched.password && Boolean(errors.password)}
              helperText={
                touched.password && errors.password
                  ? String(errors.password)
                  : ""
              }
            />
            <Button type="submit">Login</Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
