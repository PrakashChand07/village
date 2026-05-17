const express = require('express');
const router = express.Router();
const {
  getAllTestSeries,
  getTestSeriesById,
  createTestSeries,
  updateTestSeries,
  deleteTestSeries,
  getAllTestSeriesAdmin,
} = require('../controllers/testSeriesController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllTestSeries);
router.get('/admin/all', protect, adminOnly, getAllTestSeriesAdmin);
router.get('/:id', getTestSeriesById);

// Admin routes
router.post('/', protect, adminOnly, createTestSeries);
router.put('/:id', protect, adminOnly, updateTestSeries);
router.delete('/:id', protect, adminOnly, deleteTestSeries);

module.exports = router;
