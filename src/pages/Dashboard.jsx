import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ComplaintList from "../components/ComplaintList.jsx";
import ComplaintFilters from "../components/ComplaintFilters.jsx";
import AdminDashboard from "../components/AdminDashboard.jsx";
import { AlertCircle } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/complaints`,
        {
          params: filters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("response", response);

      setComplaints(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {user?.role === "admin" ? (
        <AdminDashboard
          complaints={complaints}
          onDataSeeded={fetchComplaints}
        />
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
            <p className="mt-2 text-gray-600">
              Track and manage your complaints in one place
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <ComplaintFilters filters={filters} setFilters={setFilters} />
          <ComplaintList
            complaints={complaints}
            onStatusChange={fetchComplaints}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
