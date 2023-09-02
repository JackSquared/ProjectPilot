import React, { useState } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Layout from "./components/nav/Layout";
import Login from "./components/user/Login";
import Dashboard from "./components/Dashboard";
import View from "./components/project/View";
import SignUp from "./components/user/Register";
import { AuthContext } from "./AuthContext";
import { onAuth, onSignUp } from "./services/auth";
import routes from "./routes/routes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = async (email: string, password: string) => {
    const isAuthenticated = await onAuth(email, password);
    setIsAuthenticated(isAuthenticated);
  };

  const handleSignUp = async (email: string, password: string) => {
    const isAuthenticated = await onSignUp(email, password);
    setIsAuthenticated(isAuthenticated);
  };

  const routing = useRoutes(
    routes({ isAuthenticated, onAuth: handleAuth, onSignUp: handleSignUp }),
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Layout>{routing}</Layout>
    </AuthContext.Provider>
  );
}

export default App;
