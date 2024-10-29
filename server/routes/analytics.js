import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// Helper function to calculate duration in hours
const calculateHoursDifference = (start, end) => {
  return (end - start) / (1000 * 60 * 60);
};

// route to get analytics data for specified time range
router.get("/", async (req, res) => {
  try {
    const { days } = req.query;

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(days));

    // 1. Complaint timeline
    const timeline = await Complaint.aggregate([
      { $match: { createdAt: { $gte: dateFrom } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Trend analysis
    const categoryTrends = await Complaint.aggregate([
      { $match: { createdAt: { $gte: dateFrom } } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Average resoluation duration
    const resolvedComplaints = await Complaint.find({
      createdAt: { $gte: dateFrom },
      status: "Resolved",
    }).exec();

    const totalResolutionhours = resolvedComplaints.reduce((sum, complaint) => {
      return complaint.resolvedAt
        ? sum +
            calculateHoursDifference(complaint.createdAt, complaint.resolvedAt)
        : sum;
    }, 0);

    const averageResolutionDuration =
      totalResolutionhours / resolvedComplaints.length || 0;

    // 4. Resolution Rate
    const totalComplaintsInTimeline = await Complaint.countDocuments({
      createdAt: { $gte: dateFrom },
    }).exec();

    const resoluationRate =
      (resolvedComplaints.length / totalComplaintsInTimeline) * 100;

    // 5. Status distribution
    const statusDistribution = await Complaint.aggregate([
      { $match: { createdAt: { $gte: dateFrom } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // 6. Priority Distribution
    const priorityDistribution = await Complaint.aggregate([
      { $match: { createdAt: { $gte: dateFrom } } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    // 7. Resolution Delay by Category

    // Define threshold in hours for delay analysis
    const delayThresholdHours = 48;

    const delayByCategory = await Complaint.aggregate([
      {
        $match: { createdAt: { $gte: dateFrom }, status: { $ne: "Resolved" } },
      },
      {
        $addFields: {
          delayDuration: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
        },
      },
      { $match: { delayDuration: { $gte: delayThresholdHours } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      timeline,
      trends: categoryTrends,
      averageResolutionDuration: averageResolutionDuration.toFixed(2),
      resoluationRate: resoluationRate.toFixed(2),
      statusDistribution,
      priorityDistribution,
      delayByCategory,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});

export default router;
