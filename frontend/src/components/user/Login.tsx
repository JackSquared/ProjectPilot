import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email is not valid')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
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
      <Form>
        <label htmlFor='email'>Email</label>
        <Field name='email' type='email' />
        <ErrorMessage name='email' component='div' />

        <label htmlFor='password'>Password</label>
        <Field name='password' type='password' />
        <ErrorMessage name='password' component='div' />

        <button type='submit'>Login</button>
      </Form>
    </Formik>
  );
};

export default Login;
