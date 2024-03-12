import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ valueHome, pageType, children }) => {
  if (pageType === "startPages") {
    if (valueHome === "/points") {
      return <Navigate to="/" />;
    } else {
      return children;
    }
  } else if (pageType === "gamePages") {
    if (valueHome === "/home") {
      return <Navigate to="/" />;
    } else {
      return children;
    }
  }
};
