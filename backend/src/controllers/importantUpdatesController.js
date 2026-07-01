const News = require('../models/News');
const GovernmentJob = require('../models/GovernmentJob');
const Result = require('../models/Result');
const Scholarship = require('../models/Scholarship');
const StudyMaterial = require('../models/StudyMaterial');
const TestSeries = require('../models/TestSeries');
const VillageScheme = require('../models/VillageScheme');

// @desc    Get all active important updates across all collections
// @route   GET /api/important-updates
// @access  Public
const getImportantUpdates = async (req, res) => {
  try {
    const { limit, page = 1 } = req.query;

    const [news, jobs, results, scholarships, studyMaterials, testSeries, schemes] = await Promise.all([
      News.find({ isImportantUpdate: true, isActive: true }),
      GovernmentJob.find({ isImportantUpdate: true, isActive: true }),
      Result.find({ isImportantUpdate: true, isActive: true }),
      Scholarship.find({ isImportantUpdate: true, isActive: true }),
      StudyMaterial.find({ isImportantUpdate: true, isActive: true }),
      TestSeries.find({ isImportantUpdate: true, isActive: true }),
      VillageScheme.find({ isImportantUpdate: true, isActive: true }),
    ]);

    // Map and format each type
    const items = [
      ...news.map(item => ({
        _id: item._id,
        title: item.title,
        type: 'news',
        date: item.date || new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        isNewPost: item.isNewPost,
        slug: `/news/${item._id}`,
        createdAt: item.createdAt,
      })),
      ...jobs.map(item => ({
        _id: item._id,
        title: item.title,
        type: 'job',
        date: item.lastDate || new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        isNewPost: item.isNewPost,
        slug: `/government-jobs/${item._id}`,
        createdAt: item.createdAt,
      })),
      ...results.map(item => ({
        _id: item._id,
        title: item.title,
        type: 'result',
        date: item.date || new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        isNewPost: item.isNewPost,
        slug: item.resultLink && item.resultLink !== '#' ? item.resultLink : `/results`,
        createdAt: item.createdAt,
      })),
      ...scholarships.map(item => ({
        _id: item._id,
        title: item.title,
        type: 'scholarship',
        date: item.deadline || new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        isNewPost: item.isNewPost,
        slug: `/scholarship/${item._id}`,
        createdAt: item.createdAt,
      })),
      ...studyMaterials.map(item => ({
        _id: item._id,
        title: item.title,
        type: 'study-material',
        date: new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        isNewPost: false,
        slug: item.fileUrl ? `/${item.fileUrl}` : `/study-material`,
        createdAt: item.createdAt,
      })),
      ...testSeries.map(item => ({
        _id: item._id,
        title: item.title,
        type: 'test-series',
        date: new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        isNewPost: false,
        slug: `/test-series/series/${item._id}`,
        createdAt: item.createdAt,
      })),
      ...schemes.map(item => ({
        _id: item._id,
        title: item.title,
        type: 'scheme',
        date: new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        isNewPost: false,
        slug: `/village-schemes/${item._id}`,
        createdAt: item.createdAt,
      })),
    ];

    // Sort by createdAt descending
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = items.length;
    let paginatedItems = items;

    if (limit) {
      const numLimit = Number(limit);
      const numPage = Number(page);
      const skip = (numPage - 1) * numLimit;
      paginatedItems = items.slice(skip, skip + numLimit);
    }

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: limit ? Math.ceil(total / Number(limit)) : 1,
      data: paginatedItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getImportantUpdates };
