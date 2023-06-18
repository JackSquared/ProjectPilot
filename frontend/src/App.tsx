import React, { useState } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Layout from './components/nav/Layout';
import Login from './components/user/Login';
import Dashboard from './components/Dashboard';
import View from './components/project/View';
import SignUp from './components/user/Register';
import { AuthContext } from './AuthContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onAuth = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      console.log(data.message);

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSignUp = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.status === 409) {
        throw new Error('Email is already in use');
      } else if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();

      console.log(data.message);

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const routing = useRoutes([
    {
      path: '/',
      element: isAuthenticated ? <Dashboard /> : <Navigate to='/login' />,
    },
    {
      path: '/login',
      element: isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <Login onAuth={onAuth} />
      ),
    },
    {
      path: '/signup',
      element: isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <SignUp onSignUp={onSignUp} />
      ),
    },
    {
      path: '/logout',
      element: <Navigate to='/login' />,
    },
    {
      path: '/project/:projectId',
      element: isAuthenticated ? (
        <View project={{}} onDelete={() => {}} />
      ) : (
        <Navigate to='/login' />
      ),
    },
  ]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Layout>{routing}</Layout>
    </AuthContext.Provider>
  );
}

export default App;
