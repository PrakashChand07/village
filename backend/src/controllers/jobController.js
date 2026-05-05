const GovernmentJob = require('../models/GovernmentJob');

// ─── PUBLIC ──────────────────────────────────────────────

// @desc    Get all active government jobs
// @route   GET /api/jobs
// @access  Public
const getPublicJobs = async (req, res) => {
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
    const jobs = await GovernmentJob.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await GovernmentJob.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getPublicJobById = async (req, res) => {
  try {
    const job = await GovernmentJob.findOne({ _id: req.params.id, isActive: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── ADMIN ───────────────────────────────────────────────

// @desc    Get ALL jobs (including inactive) for admin
// @route   GET /api/admin/jobs
// @access  Private
const getAllJobs = async (req, res) => {
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
    const jobs = await GovernmentJob.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await GovernmentJob.countDocuments(query);

    res.status(200).json({ success: true, total, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create new job
// @route   POST /api/admin/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const job = await GovernmentJob.create(req.body);
    res.status(201).json({ success: true, message: 'Job created successfully', data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/admin/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const job = await GovernmentJob.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, message: 'Job updated successfully', data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await GovernmentJob.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Toggle job active/inactive
// @route   PATCH /api/admin/jobs/:id/toggle
// @access  Private
const toggleJob = async (req, res) => {
  try {
    const job = await GovernmentJob.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    job.isActive = !job.isActive;
    await job.save();
    res.status(200).json({ success: true, message: `Job ${job.isActive ? 'activated' : 'deactivated'}`, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getPublicJobs, getPublicJobById, getAllJobs, createJob, updateJob, deleteJob, toggleJob };
