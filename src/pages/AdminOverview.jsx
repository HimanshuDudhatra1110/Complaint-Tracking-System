import React, { useState } from "react";
import { AlertTriangle, Database, Trash2 } from "lucide-react";
import StatsOverview from "../components/admin/StatsOverview";
import RecentComplaints from "../components/admin/RecentComplaints";
import axios from "axios";

const AdminOverview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSeedData = async (type) => {
    // Removed type annotation
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/seed/${type}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status !== 200) throw new Error(`Failed to seed ${type}`);
      window.location.reload();
    } catch (err) {
      setError(`Failed to seed ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDropDatabase = async () => {
    if (
      !window.confirm(
        "⚠️ WARNING: This will delete all data except admin users. Are you absolutely sure?"
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/seed/drop`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status !== 200) throw new Error("Failed to drop database");
      window.location.reload();
    } catch (err) {
      setError("Failed to drop database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-600">
            Manage system data and view recent activities
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleSeedData("users")}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Database className="h-4 w-4 mr-2" />
            Seed Users
          </button>

          <button
            onClick={() => handleSeedData("complaints")}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Database className="h-4 w-4 mr-2" />
            Seed Complaints
          </button>

          <button
            onClick={handleDropDatabase}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Drop Database
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <StatsOverview />
      <RecentComplaints />
    </div>
  );
};

export default AdminOverview;
