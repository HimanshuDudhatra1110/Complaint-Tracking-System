import React from "react";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage application settings and preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
