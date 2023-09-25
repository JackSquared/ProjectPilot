import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/user/Login";
import Dashboard from "../components/Dashboard";
import View from "../components/project/View";
import SignUp from "../components/user/Register";

type RouteProps = {
  isAuthenticated: boolean;
  onAuth: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
};

const routes = ({ isAuthenticated, onAuth, onSignUp }: RouteProps) => [
  {
    path: "/",
    element: isAuthenticated ? <Dashboard /> : <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: isAuthenticated ? <Navigate to="/" /> : <Login onAuth={onAuth} />,
  },
  {
    path: "/signup",
    element: isAuthenticated ? (
      <Navigate to="/" />
    ) : (
      <SignUp onSignUp={onSignUp} />
    ),
  },
  {
    path: "/logout",
    element: <Navigate to="/login" />,
  },
  {
    path: "/project/:projectId",
    element: isAuthenticated ? (
      <View project={{}} onDelete={() => {}} />
    ) : (
      <Navigate to="/login" />
    ),
  },
];

export default routes;
