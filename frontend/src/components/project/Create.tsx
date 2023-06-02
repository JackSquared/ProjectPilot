import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Create = () => {
  const initialValues = {
    name: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Project name is required'),
    description: Yup.string().required('Project description is required'),
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
        <label htmlFor='name'>Project Name</label>
        <Field name='name' type='text' />
        <ErrorMessage name='name' component='div' />

        <label htmlFor='description'>Project Description</label>
        <Field name='description' type='text' />
        <ErrorMessage name='description' component='div' />

        <button type='submit'>Create Project</button>
      </Form>
    </Formik>
  );
};

export default Create;
