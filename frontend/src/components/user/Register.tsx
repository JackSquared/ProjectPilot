import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string()
      .email('Email is not valid')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
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
        <label htmlFor='username'>Username</label>
        <Field name='username' type='text' />
        <ErrorMessage name='username' component='div' />

        <label htmlFor='email'>Email</label>
        <Field name='email' type='email' />
        <ErrorMessage name='email' component='div' />

        <label htmlFor='password'>Password</label>
        <Field name='password' type='password' />
        <ErrorMessage name='password' component='div' />

        <button type='submit'>Register</button>
      </Form>
    </Formik>
  );
};

export default Register;
