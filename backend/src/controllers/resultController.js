const Result = require('../models/Result');

// ─── PUBLIC ──────────────────────────────────────────────

const getPublicResults = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const results = await Result.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Result.countDocuments(query);

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getPublicResultById = async (req, res) => {
  try {
    const result = await Result.findOne({ _id: req.params.id, isActive: true });
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── ADMIN ───────────────────────────────────────────────

const getAllResults = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const results = await Result.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Result.countDocuments(query);

    res.status(200).json({ success: true, total, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const createResult = async (req, res) => {
  try {
    const result = await Result.create(req.body);
    res.status(201).json({ success: true, message: 'Result created successfully', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.status(200).json({ success: true, message: 'Result updated successfully', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.status(200).json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const toggleResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    result.isActive = !result.isActive;
    await result.save();
    res.status(200).json({ success: true, message: `Result ${result.isActive ? 'activated' : 'deactivated'}`, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getPublicResults, getPublicResultById, getAllResults, createResult, updateResult, deleteResult, toggleResult };
