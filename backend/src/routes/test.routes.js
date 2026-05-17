const express = require('express');
const router = express.Router();
const {
  getTestsBySeriesId,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  getTestsAdminBySeries,
} = require('../controllers/testController');
const { protect, adminOnly } = require('../middleware/auth');

// Public / user routes
router.get('/series/:seriesId', getTestsBySeriesId);
router.get('/admin/series/:seriesId', protect, adminOnly, getTestsAdminBySeries);
router.get('/:id', getTestById);

// Admin routes
router.post('/', protect, adminOnly, createTest);
router.put('/:id', protect, adminOnly, updateTest);
router.delete('/:id', protect, adminOnly, deleteTest);

module.exports = router;
