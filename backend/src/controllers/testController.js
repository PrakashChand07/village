const Test = require('../models/Test');
const TestSeries = require('../models/TestSeries');
const Question = require('../models/Question');

// @desc    Get all tests in a series (public)
// @route   GET /api/tests/series/:seriesId
const getTestsBySeriesId = async (req, res) => {
  try {
    const tests = await Test.find({ testSeries: req.params.seriesId, isActive: true }).sort({ createdAt: 1 });
    // Attach question count for each test
    const testsWithCounts = await Promise.all(
      tests.map(async (t) => {
        const qCount = await Question.countDocuments({ test: t._id });
        const totalMarks = qCount; // default 1 mark each, will update if needed
        return { ...t.toObject(), totalQuestions: qCount, totalMarks };
      })
    );
    res.status(200).json({ success: true, data: testsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single test details (public)
// @route   GET /api/tests/:id
const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('testSeries', 'title category difficulty isFree price');
    if (!test || !test.isActive) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    const qCount = await Question.countDocuments({ test: test._id });
    res.status(200).json({ success: true, data: { ...test.toObject(), totalQuestions: qCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create test (admin)
// @route   POST /api/tests
const createTest = async (req, res) => {
  try {
    const { title, description, testSeries, duration } = req.body;
    const series = await TestSeries.findById(testSeries);
    if (!series) return res.status(404).json({ success: false, message: 'Test series not found' });

    const test = await Test.create({ title, description, testSeries, duration });
    res.status(201).json({ success: true, message: 'Test created', data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update test (admin)
// @route   PUT /api/tests/:id
const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.status(200).json({ success: true, message: 'Test updated', data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete test (admin)
// @route   DELETE /api/tests/:id
const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    // Also delete all questions for this test
    await Question.deleteMany({ test: req.params.id });
    res.status(200).json({ success: true, message: 'Test and its questions deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all tests for admin (including inactive)
// @route   GET /api/tests/admin/series/:seriesId
const getTestsAdminBySeries = async (req, res) => {
  try {
    const tests = await Test.find({ testSeries: req.params.seriesId }).sort({ createdAt: 1 });
    const testsWithCounts = await Promise.all(
      tests.map(async (t) => {
        const qCount = await Question.countDocuments({ test: t._id });
        return { ...t.toObject(), totalQuestions: qCount };
      })
    );
    res.status(200).json({ success: true, data: testsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getTestsBySeriesId, getTestById, createTest, updateTest, deleteTest, getTestsAdminBySeries };
