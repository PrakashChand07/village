const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getPublicScholarships, getPublicScholarshipById,
  getAllScholarships, createScholarship, updateScholarship, deleteScholarship, toggleScholarship
} = require('../controllers/scholarshipController');

// Public routes
router.get('/', getPublicScholarships);
router.get('/:id', getPublicScholarshipById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllScholarships);
router.post('/admin', protect, adminOnly, createScholarship);
router.put('/admin/:id', protect, adminOnly, updateScholarship);
router.delete('/admin/:id', protect, adminOnly, deleteScholarship);
router.patch('/admin/:id/toggle', protect, adminOnly, toggleScholarship);

module.exports = router;
