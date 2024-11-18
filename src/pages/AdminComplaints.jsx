import React, { useEffect, useState } from "react";
import ComplaintFilters from "../components/ComplaintFilters";
import axios from "axios";
import AssignedComplaintList from "../components/AssignedComplaintList";
import { AlertCircle } from "lucide-react";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
  });
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchComplaints();
  }, [filters, limit, page]);

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  };

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/complaints/admin`,
        {
          params: { ...filters, limit, page },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200)
        throw new Error("Failed to fetch complaints");

      setComplaints(response.data.complaints);
      setTotalComplaints(response.data.totalComplaints);
      setError("");
    } catch (err) {
      setError("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < totalComplaints) {
      setPage((prev) => prev + 1);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Complaint Management
          </h1>
          <p className="text-gray-600">View and manage user complaints</p>
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="entries" className="text-gray-600 mr-2">
            Show entries:
          </label>
          <select
            id="entries"
            value={limit}
            onChange={handleLimitChange}
            className="border border-gray-300 rounded p-1"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <ComplaintFilters filters={filters} setFilters={setFilters} />
      <AssignedComplaintList
        complaints={complaints}
        expandedComplaint={expandedComplaint}
        setExpandedComplaint={setExpandedComplaint}
        handleComplaintSubmit={handleComplaintSubmit}
      />
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          className={`${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold py-2 px-4 rounded-md`}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className={`${
            page * limit >= totalComplaints
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold py-2 px-4 rounded-md`}
          disabled={page * limit >= totalComplaints}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminComplaints;
