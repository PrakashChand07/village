const TestSeries = require('../models/TestSeries');
const Test = require('../models/Test');

// @desc    Get all active test series (public)
// @route   GET /api/test-series
const getAllTestSeries = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;

    const series = await TestSeries.find(filter).sort({ createdAt: -1 });

    // Attach totalTests count for each series
    const seriesWithCounts = await Promise.all(
      series.map(async (s) => {
        const testCount = await Test.countDocuments({ testSeries: s._id, isActive: true });
        return { ...s.toObject(), totalTests: testCount };
      })
    );

    res.status(200).json({ success: true, data: seriesWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single test series (public)
// @route   GET /api/test-series/:id
const getTestSeriesById = async (req, res) => {
  try {
    const series = await TestSeries.findById(req.params.id);
    if (!series || !series.isActive) {
      return res.status(404).json({ success: false, message: 'Test series not found' });
    }
    const testCount = await Test.countDocuments({ testSeries: series._id, isActive: true });
    res.status(200).json({ success: true, data: { ...series.toObject(), totalTests: testCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create test series (admin)
// @route   POST /api/test-series
const createTestSeries = async (req, res) => {
  try {
    const { title, description, category, difficulty, price, discountPrice, isFree, image } = req.body;
    const series = await TestSeries.create({
      title, description, category, difficulty,
      price: price !== undefined ? price : 499,
      discountPrice: discountPrice || null,
      isFree: isFree || price === 0,
      image: image || '',
      createdBy: req.admin._id,
    });
    res.status(201).json({ success: true, message: 'Test series created', data: series });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update test series (admin)
// @route   PUT /api/test-series/:id
const updateTestSeries = async (req, res) => {
  try {
    const series = await TestSeries.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!series) return res.status(404).json({ success: false, message: 'Test series not found' });
    res.status(200).json({ success: true, message: 'Test series updated', data: series });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete test series (admin)
// @route   DELETE /api/test-series/:id
const deleteTestSeries = async (req, res) => {
  try {
    const series = await TestSeries.findByIdAndDelete(req.params.id);
    if (!series) return res.status(404).json({ success: false, message: 'Test series not found' });
    res.status(200).json({ success: true, message: 'Test series deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all test series for admin (including inactive)
// @route   GET /api/test-series/admin/all
const getAllTestSeriesAdmin = async (req, res) => {
  try {
    const series = await TestSeries.find().sort({ createdAt: -1 });
    const seriesWithCounts = await Promise.all(
      series.map(async (s) => {
        const testCount = await Test.countDocuments({ testSeries: s._id });
        return { ...s.toObject(), totalTests: testCount };
      })
    );
    res.status(200).json({ success: true, data: seriesWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getAllTestSeries, getTestSeriesById, createTestSeries, updateTestSeries, deleteTestSeries, getAllTestSeriesAdmin };
