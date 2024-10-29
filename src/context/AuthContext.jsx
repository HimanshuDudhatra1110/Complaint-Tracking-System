import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the API base URL from the environment variable
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${apiUrl}/auth/validate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.user) {
            setUser(response.data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false); // No token, end loading immediately
    }
  }, [apiUrl]);

  const login = async (email, password) => {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email,
      password,
    });
    const data = response.data;
    if (response.status !== 200) throw new Error(data.message);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } else {
      throw new Error(data.message);
    }
  };

  const register = async (name, email, password, department) => {
    const response = await axios.post(`${apiUrl}/auth/register`, {
      name,
      email,
      password,
      department,
    });
    console.log("register sent from auth");

    const data = response.data;
    if (response.status !== 201) throw new Error(data.message);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } else {
      throw new Error(data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    <Navigate to="/login" />;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
