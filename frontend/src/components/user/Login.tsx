import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f2f2f2;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: white;
`;

const StyledField = styled(Field)`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const StyledErrorMessage = styled(ErrorMessage)`
  color: red;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

interface LoginProps {
  onAuth: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onAuth }) => {
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
    onAuth(values.email, values.password); // Call the onAuth function with the form values
    setSubmitting(false);
  };

  return (
    <LoginWrapper>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <StyledForm>
          <label htmlFor='email'>Email</label>
          <StyledField name='email' type='email' />
          <StyledErrorMessage name='email' component='div' />

          <label htmlFor='password'>Password</label>
          <StyledField name='password' type='password' />
          <StyledErrorMessage name='password' component='div' />

          <StyledButton type='submit'>Login</StyledButton>
        </StyledForm>
      </Formik>
    </LoginWrapper>
  );
};

export default Login;
