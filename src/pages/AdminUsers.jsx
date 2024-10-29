import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Building,
  Calendar,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page, limit, sortConfig]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(response.data);
      setTotalUsers(response.data.length);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const sortUsers = (field) => {
    const isAsc = sortConfig.field === field && sortConfig.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    setSortConfig({ field, direction });
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (users.length === limit) setPage(page + 1);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">View and manage all users in the system</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

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

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-500 border-b">
          <div
            className="col-span-3 flex items-center cursor-pointer"
            onClick={() => sortUsers("name")}
          >
            Name
            {sortConfig.field === "name" ? (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </div>
          <div
            className="col-span-3 hidden md:flex items-center cursor-pointer"
            onClick={() => sortUsers("email")}
          >
            Email
            {sortConfig.field === "email" ? (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </div>
          <div
            className="col-span-2 hidden md:flex items-center cursor-pointer"
            onClick={() => sortUsers("department")}
          >
            Department
            {sortConfig.field === "department" ? (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </div>
          <div
            className="col-span-2 flex items-center cursor-pointer"
            onClick={() => sortUsers("role")}
          >
            Role
            {sortConfig.field === "role" ? (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </div>
          <div
            className="col-span-2 flex items-center cursor-pointer"
            onClick={() => sortUsers("complaintCount")}
          >
            Complaints
            {sortConfig.field === "complaintCount" ? (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </div>
        </div>

        <div className="divide-y">
          {users.map((user) => (
            <div key={user._id} className="hover:bg-gray-50">
              <button
                onClick={() =>
                  setExpandedUser(expandedUser === user._id ? null : user._id)
                }
                className="w-full text-left"
              >
                <div className="grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-3 font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="col-span-3 hidden md:block text-gray-500">
                    {user.email}
                  </div>
                  <div className="col-span-2 hidden md:block text-gray-500">
                    {user.department}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="col-span-2 text-center font-medium text-gray-900">
                    {user.complaintCount}
                  </div>
                </div>
              </button>
              {expandedUser === user._id && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-5 w-5" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Building className="h-5 w-5" />
                      <span>{user.department}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-5 w-5" />
                      <span>
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
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
            users.length < limit
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold py-2 px-4 rounded-md`}
          disabled={users.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;
