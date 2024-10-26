import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";
import TimelineChart from "../components/admin/TimelineChart";
import TrendAnalysis from "../components/admin/TrendAnalysis";

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/analytics`,
        {
          params: { days: timeRange },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics & Insights
          </h1>
          <p className="text-gray-600">
            Detailed analysis of complaint patterns and trends
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Complaint Timeline
        </h2>
        <TimelineChart data={analytics?.timeline} />
      </div>

      {/* Trend Analysis */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Trend Analysis
        </h2>
        <TrendAnalysis data={analytics?.trends} />
      </div>

      {/* Response Time Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Average Response Time
          </h2>
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.averageResponseTime || "0"} hours
              </p>
              <p className="text-sm text-gray-500">
                Average time to first response
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Resolution Rate
          </h2>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.resolutionRate || "0"}%
              </p>
              <p className="text-sm text-gray-500">
                Complaints resolved successfully
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
