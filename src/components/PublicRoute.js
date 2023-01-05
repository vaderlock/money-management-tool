import React from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = localStorage.getItem("user");
  // If the user is logged in, the PublicRoute component returns a Navigate component
  // that redirects the user to the home page.
  if (user) {
    return <Navigate to="/" />;
  }
  // If the user is not logged in, the PublicRoute component returns the children element.
  else return children;
}

export default PublicRoute;
