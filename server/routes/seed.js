import express from "express";
import { auth, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import { complaintsDataToSeed } from "./data.js";

const router = express.Router();

router.post("/add-complaints", async (req, res) => {
  const complaintsData = complaintsDataToSeed;

  const result = await Complaint.insertMany(complaintsData);

  res.json({ message: "Complaints added successfully", result });
});

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    // Clear existing test data
    await User.deleteMany({ email: /^test/ });
    await Complaint.deleteMany({ title: /^Test/ });

    // Create test users
    const users = await User.insertMany([
      {
        name: "Test Student 1",
        email: "test.student1@example.com",
        password: "$2a$10$test1234567890123456",
        department: "Computer Science",
        role: "student",
      },
      {
        name: "Test Student 2",
        email: "test.student2@example.com",
        password: "$2a$10$test1234567890123456",
        department: "Electronics",
        role: "student",
      },
    ]);

    // Create test complaints
    const categories = [
      "Academic",
      "Infrastructure",
      "Hostel",
      "Canteen",
      "Other",
    ];
    const priorities = ["Low", "Medium", "High"];
    const statuses = ["Pending", "In Progress", "Resolved", "Rejected"];

    const complaints = [];
    for (let i = 0; i < 20; i++) {
      complaints.push({
        title: `Test Complaint ${i + 1}`,
        description: `This is a test complaint description ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        submittedBy: users[Math.floor(Math.random() * users.length)]._id,
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        ),
      });
    }

    await Complaint.insertMany(complaints);

    res.json({ message: "Test data seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
