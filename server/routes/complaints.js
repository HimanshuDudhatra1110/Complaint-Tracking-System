import express from 'express';
import Complaint from '../models/Complaint.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all complaints (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    const filter = {};

    if (req.user.role !== 'admin') {
      filter.submittedBy = req.user._id;
    }
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new complaint
router.post('/', auth, async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      submittedBy: req.user._id
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update complaint status (admin only)
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
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
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    complaint.comments.push({
      text: req.body.text,
      user: req.user._id
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;