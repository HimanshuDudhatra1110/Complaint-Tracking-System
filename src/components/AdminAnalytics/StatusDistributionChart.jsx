import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const colors = ["#82ca9d", "#8884d8", "#ff6f61", "#ffc658", "#a4de6b"];

const StatusDistributionChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
      >
        <XAxis
          dataKey="_id"
          label={{ value: "Status", position: "insideBottom", offset: -20 }}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatusDistributionChart;
