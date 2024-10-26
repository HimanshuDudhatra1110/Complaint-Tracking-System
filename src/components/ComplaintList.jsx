import React from "react";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import axios from "axios";

const statusIcons = {
  Pending: Clock,
  "In Progress": AlertTriangle,
  Resolved: CheckCircle,
  Rejected: XCircle,
};

const statusColors = {
  Pending: "text-yellow-500",
  "In Progress": "text-blue-500",
  Resolved: "text-green-500",
  Rejected: "text-red-500",
};

const ComplaintList = ({ complaints, onStatusChange }) => {
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/complaints/${id}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200) throw new Error("Failed to update status");
      onStatusChange(); // Refresh or notify after status change
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="mt-6 bg-white shadow-sm rounded-lg divide-y divide-gray-200">
      {complaints.map((complaint) => {
        const StatusIcon = statusIcons[complaint.status];
        return (
          <div key={complaint._id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {complaint.title}
                </h3>
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                  <span>{complaint.category}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <StatusIcon
                      className={`h-4 w-4 mr-1 ${
                        statusColors[complaint.status]
                      }`}
                    />
                    {complaint.status}
                  </span>
                  <span>•</span>
                  <span
                    className={`font-medium ${
                      complaint.priority === "High"
                        ? "text-red-600"
                        : complaint.priority === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {complaint.priority} Priority
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-gray-600">{complaint.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ComplaintList;
