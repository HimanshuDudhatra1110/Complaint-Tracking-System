import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewComplaint from "./pages/NewComplaint";
import { AuthProvider } from "./context/AuthContext.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import AdminRoute from "./components/AdminRoutes/AdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminOverview from "./pages/AdminOverview.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import CreateUserPage from "./pages/CreateUserPage.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import AdminComplaints from "./pages/AdminComplaints.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/new-complaint" element={<NewComplaint />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="complaints" element={<AdminComplaints />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/create" element={<CreateUserPage />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
