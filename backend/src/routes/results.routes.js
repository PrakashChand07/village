const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getPublicResults, getPublicResultById,
  getAllResults, createResult, updateResult, deleteResult, toggleResult
} = require('../controllers/resultController');

// Public routes
router.get('/', getPublicResults);
router.get('/:id', getPublicResultById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllResults);
router.post('/admin', protect, adminOnly, createResult);
router.put('/admin/:id', protect, adminOnly, updateResult);
router.delete('/admin/:id', protect, adminOnly, deleteResult);
router.patch('/admin/:id/toggle', protect, adminOnly, toggleResult);

module.exports = router;
