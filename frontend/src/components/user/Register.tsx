import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box } from "@mui/material";

interface SignUpProps {
  onSignUp: (email: string, password: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log(values);
    onSignUp(values.email, values.password);
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
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={
                touched.confirmPassword && errors.confirmPassword
                  ? String(errors.confirmPassword)
                  : ""
              }
            />
            <Button type="submit">Sign Up</Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignUp;
