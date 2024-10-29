import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a loading indicator or nothing until the auth check completes
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Check if user is authenticated and has an admin role
  if (!user || user.role !== "admin") {
    // Redirect to login if not authenticated or unauthorized
    return <Navigate to="/login" />;
  }

  // Render the child component if the user has admin privileges
  return <Outlet />;
};

export default AdminRoute;
