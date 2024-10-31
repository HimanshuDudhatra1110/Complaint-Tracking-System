import express from "express";
import { auth, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js"; // Import Complaint model
import { check, validationResult } from "express-validator";

const router = express.Router();

// Get all users with complaint count
router.get("/", auth, adminOnly, async (req, res) => {
  // Get page and limit for pagination from query parameters
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 100 ? 100 : limit; // Set limit to 100 if greater than 100

  const sortField = req.query.sortField || "name";
  const sortOrder = req.query.sortOrder || "asc";

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  try {
    // Count total users, excluding the logged-in user
    const totalUsers = await User.countDocuments({
      _id: { $ne: req.user._id },
    });

    // Fetch all users except the logged-in user, with sorting and pagination
    const users = await User.find({ _id: { $ne: req.user._id } })
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

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

    // Send response with users and total user count for pagination
    res.status(200).json({ users: usersWithComplaintCount, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create a user (admin only)
router.post(
  "/create",
  auth,
  adminOnly,
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Please enter a valid email address"),
    check("password").notEmpty().withMessage("Password is required"),
    check("role").notEmpty().withMessage("Role is required"),
    check("department").notEmpty().withMessage("Department is required"),
  ],
  async (req, res) => {
    try {
      // check for validation error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
      }

      // check if user already exists with the email
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email." });
      }

      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Change Password
router.post(
  "/change-password",
  auth,
  [
    check("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    check("newPassword").notEmpty().withMessage("New password is required"),
  ],
  async (req, res) => {
    // check for validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      // Check if the current password is correct
      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid current password" });
      }

      // Update the password
      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

export default router;
