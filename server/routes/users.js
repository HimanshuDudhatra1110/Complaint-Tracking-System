import express from "express";
import { auth, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js"; // Import Complaint model

const router = express.Router();

// Get all users with complaint count
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    // get page and limit for pagination from query parameters
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 100 ? 100 : limit; // set limit to 100 if limit is greater than 100

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch all users except the logged-in user
    const users = await User.find({ _id: { $ne: req.user._id } });

    // Map over users to count complaints for each user
    const usersWithComplaintCount = await Promise.all(
      users.map(async (user) => {
        // Count complaints for the current user
        const complaintCount = await Complaint.countDocuments({
          submittedBy: user._id,
        });

        return {
          ...user.toObject(),
          complaintCount, // Add complaint count to user object
        };
      })
    );

    res.status(200).json(usersWithComplaintCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
