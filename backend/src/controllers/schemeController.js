const VillageScheme = require('../models/VillageScheme');

// ─── PUBLIC ──────────────────────────────────────────────

const getPublicSchemes = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const schemes = await VillageScheme.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await VillageScheme.countDocuments(query);

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getPublicSchemeById = async (req, res) => {
  try {
    const scheme = await VillageScheme.findOne({ _id: req.params.id, isActive: true });
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.status(200).json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── ADMIN ───────────────────────────────────────────────

const getAllSchemes = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const schemes = await VillageScheme.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await VillageScheme.countDocuments(query);

    res.status(200).json({ success: true, total, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const createScheme = async (req, res) => {
  try {
    const scheme = await VillageScheme.create(req.body);
    res.status(201).json({ success: true, message: 'Scheme created successfully', data: scheme });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateScheme = async (req, res) => {
  try {
    const scheme = await VillageScheme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.status(200).json({ success: true, message: 'Scheme updated successfully', data: scheme });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteScheme = async (req, res) => {
  try {
    const scheme = await VillageScheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.status(200).json({ success: true, message: 'Scheme deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const toggleScheme = async (req, res) => {
  try {
    const scheme = await VillageScheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    scheme.isActive = !scheme.isActive;
    await scheme.save();
    res.status(200).json({ success: true, message: `Scheme ${scheme.isActive ? 'activated' : 'deactivated'}`, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getPublicSchemes, getPublicSchemeById, getAllSchemes, createScheme, updateScheme, deleteScheme, toggleScheme };
