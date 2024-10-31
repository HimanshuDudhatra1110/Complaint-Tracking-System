import React, { useState, useEffect } from "react";
import ComplaintList from "../components/ComplaintList.jsx";
import ComplaintFilters from "../components/ComplaintFilters.jsx";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal.jsx";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Prevent navigation until loading is complete
    if (!user) {
      navigate("/login");
    } else if (user.role === "admin") {
      navigate("/admin");
    }
  }, [user, navigate, loading]);

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
      setComplaints(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedComplaintId(id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/complaints/${selectedComplaintId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Update the complaints state to remove the deleted complaint
      setComplaints(
        complaints.filter((complaint) => complaint._id !== selectedComplaintId)
      );
      // Close the modal
      setModalOpen(false);
    } catch (err) {
      console.error("Error deleting complaint:", err);
      setError("Failed to delete complaint");
      setModalOpen(false);
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
    <div className="max-w-7xl mx-auto pt-16">
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
        onDelete={handleDeleteClick} // Pass the handleDelete function to ComplaintList
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
