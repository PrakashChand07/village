const News = require('../models/News');

// ─── PUBLIC ──────────────────────────────────────────────

const getPublicNews = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const news = await News.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await News.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: news,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getPublicNewsById = async (req, res) => {
  try {
    const news = await News.findOne({ _id: req.params.id, isActive: true });
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── ADMIN ───────────────────────────────────────────────

const getAllNews = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const news = await News.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await News.countDocuments(query);

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json({ success: true, message: 'News created successfully', data: news });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.status(200).json({ success: true, message: 'News updated successfully', data: news });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.status(200).json({ success: true, message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const toggleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    news.isActive = !news.isActive;
    await news.save();
    res.status(200).json({ success: true, message: `News ${news.isActive ? 'activated' : 'deactivated'}`, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getPublicNews, getPublicNewsById, getAllNews, createNews, updateNews, deleteNews, toggleNews };
