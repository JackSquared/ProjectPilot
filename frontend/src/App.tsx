import React, { useState } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Layout from './components/nav/Layout';
import Login from './components/user/Login';
import Logout from './components/user/Logout';
import Dashboard from './components/Dashboard';
import View from './components/project/View';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onAuth = () => {
    setIsAuthenticated(true);
  };

  const onLogout = () => {
    setIsAuthenticated(false);
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
      path: '/logout',
      element: isAuthenticated ? (
        <Logout onLogout={onLogout} />
      ) : (
        <Navigate to='/login' />
      ),
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

  return <Layout>{routing}</Layout>;
}

export default App;
