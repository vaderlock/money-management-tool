import React from "react";
import { Navigate } from "react-router-dom";
// The ProtectedRoute component takes a children element as an argument and checks if the user is logged in.
function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  // If the user is logged in, the ProtectedRoute component returns the children element.
  if (user) {
    return children;
  }
  // If the user is not logged in, the ProtectedRoute component returns a Navigate component that
  // redirects the user to the login page.
  else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
