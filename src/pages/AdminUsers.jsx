import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Building,
  Calendar,
} from "lucide-react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">View and manage all users in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-500 border-b">
          <div className="col-span-4">Name</div>
          <div className="col-span-3 hidden md:block">Email</div>
          <div className="col-span-3 hidden md:block">Department</div>
          <div className="col-span-2">Role</div>
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
                  <div className="col-span-4 font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="col-span-3 hidden md:block text-gray-500">
                    {user.email}
                  </div>
                  <div className="col-span-3 hidden md:block text-gray-500">
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
    </div>
  );
};

export default AdminUsers;
