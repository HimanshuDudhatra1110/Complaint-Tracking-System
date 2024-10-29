import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import PriorityDistributionChart from "../components/AdminAnalytics/PriorityDistributionChart.jsx";
import DelayByCategoryChart from "../components/AdminAnalytics/DelayByCategoryChart.jsx";
import StatusDistributionChart from "../components/AdminAnalytics/StatusDistributionChart.jsx";
import TimelineChart from "../components/AdminAnalytics/TimelineChart.jsx";
import TrendDistributionChart from "../components/AdminAnalytics/TrendDistributionChart.jsx";

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

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complaint Timeline - Full width */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            Complaint Timeline
            <span
              data-tooltip-id="complaint-timeline-tooltip"
              data-tooltip-content="Displays the frequency of complaints over time."
              className="ml-2 cursor-pointer text-gray-500"
              data-tooltip-place="right"
            >
              ℹ️
            </span>
            <Tooltip id="complaint-timeline-tooltip" />
          </h2>
          <TimelineChart data={analytics?.timeline} />
        </div>

        {/* Trend Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            Trend Analysis
            <span
              data-tooltip-id="trend-analysis-tooltip"
              data-tooltip-content="Highlights trends in complaint submissions."
              className="ml-2 cursor-pointer text-gray-500"
              data-tooltip-place="right"
            >
              ℹ️
            </span>
            <Tooltip id="trend-analysis-tooltip" />
          </h2>
          <TrendDistributionChart data={analytics?.trends} />
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            Status Distribution
            <span
              data-tooltip-id="status-distribution-tooltip"
              data-tooltip-content="Categorizes complaints based on their current status."
              className="ml-2 cursor-pointer text-gray-500"
              data-tooltip-place="right"
            >
              ℹ️
            </span>
            <Tooltip id="status-distribution-tooltip" />
          </h2>
          <StatusDistributionChart data={analytics?.statusDistribution} />
        </div>

        {/* Average Resolution Duration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            Average Resolution Duration
            <span
              data-tooltip-id="avg-resolution-tooltip"
              data-tooltip-content="Shows the average time taken to resolve complaints."
              className="ml-2 cursor-pointer text-gray-500"
              data-tooltip-place="right"
            >
              ℹ️
            </span>
            <Tooltip id="avg-resolution-tooltip" />
          </h2>
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.averageResolutionDuration || "0"} hours
              </p>
              <p className="text-sm text-gray-500">
                Average time taken to resolve a complaint
              </p>
            </div>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            Resolution Rate
            <span
              data-tooltip-id="resolution-rate-tooltip"
              data-tooltip-content="Percentage of successfully resolved complaints."
              className="ml-2 cursor-pointer text-gray-500"
              data-tooltip-place="right"
            >
              ℹ️
            </span>
            <Tooltip id="resolution-rate-tooltip" />
          </h2>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.resoluationRate || "0"}%
              </p>
              <p className="text-sm text-gray-500">
                Complaints resolved successfully
              </p>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            Priority Distribution
            <span
              data-tooltip-id="priority-distribution-tooltip"
              data-tooltip-content="Shows the distribution of complaints by priority level."
              className="ml-2 cursor-pointer text-gray-500"
              data-tooltip-place="right"
            >
              ℹ️
            </span>
            <Tooltip id="priority-distribution-tooltip" />
          </h2>
          <PriorityDistributionChart data={analytics?.priorityDistribution} />
        </div>

        {/* Resolution Delay by Category */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            Resolution Delay by Category
            <span
              data-tooltip-id="resolution-delay-tooltip"
              data-tooltip-content="Displays categories with complaints delayed beyond 48 hours."
              className="ml-2 cursor-pointer text-gray-500"
              data-tooltip-place="right"
            >
              ℹ️
            </span>
            <Tooltip id="resolution-delay-tooltip" />
          </h2>
          <DelayByCategoryChart data={analytics?.delayByCategory} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
