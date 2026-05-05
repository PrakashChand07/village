const Scholarship = require('../models/Scholarship');

// ─── PUBLIC ──────────────────────────────────────────────

const getPublicScholarships = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const scholarships = await Scholarship.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Scholarship.countDocuments(query);

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: scholarships });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getPublicScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findOne({ _id: req.params.id, isActive: true });
    if (!scholarship) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── ADMIN ───────────────────────────────────────────────

const getAllScholarships = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const scholarships = await Scholarship.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Scholarship.countDocuments(query);

    res.status(200).json({ success: true, total, data: scholarships });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const createScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.status(201).json({ success: true, message: 'Scholarship created successfully', data: scholarship });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scholarship) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    res.status(200).json({ success: true, message: 'Scholarship updated successfully', data: scholarship });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    res.status(200).json({ success: true, message: 'Scholarship deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const toggleScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    scholarship.isActive = !scholarship.isActive;
    await scholarship.save();
    res.status(200).json({ success: true, message: `Scholarship ${scholarship.isActive ? 'activated' : 'deactivated'}`, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getPublicScholarships, getPublicScholarshipById, getAllScholarships, createScholarship, updateScholarship, deleteScholarship, toggleScholarship };
