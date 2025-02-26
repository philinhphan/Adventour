import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

// ProtectedRoute component, ensures that the user is authenticated before rendering the children components.
// If the user is not authenticated, it redirects to the login page.

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
