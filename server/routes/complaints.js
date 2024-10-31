import express from "express";
import Complaint from "../models/Complaint.js";
import { auth, adminOnly } from "../middleware/auth.js";
import { check, validationResult } from "express-validator";

const router = express.Router();

// Get all complaints (with filters)
router.get("/", auth, async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    const filter = {};

    if (req.user.role !== "admin") {
      filter.submittedBy = req.user._id;
    }
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate("submittedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new complaint
router.post(
  "/",
  auth,
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("description").notEmpty().withMessage("Description is required"),
    check("category").notEmpty().withMessage("Category is required"),
    check("priority").notEmpty().withMessage("Priority is required"),
  ],
  async (req, res) => {
    // check for validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    try {
      const complaint = new Complaint({
        ...req.body,
        submittedBy: req.user._id,
      });
      await complaint.save();
      res.status(201).json(complaint);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete complaint by user only those who created it
router.delete("/:id", auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    if (complaint.submittedBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this complaint" });
    }
    // now we can delete the complaint
    await Complaint.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Update complaint status (admin only)
router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add comment to complaint
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    complaint.comments.push({
      text: req.body.text,
      user: req.user._id,
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
