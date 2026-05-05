const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getPublicSchemes, getPublicSchemeById,
  getAllSchemes, createScheme, updateScheme, deleteScheme, toggleScheme
} = require('../controllers/schemeController');

// Public routes
router.get('/', getPublicSchemes);
router.get('/:id', getPublicSchemeById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllSchemes);
router.post('/admin', protect, adminOnly, createScheme);
router.put('/admin/:id', protect, adminOnly, updateScheme);
router.delete('/admin/:id', protect, adminOnly, deleteScheme);
router.patch('/admin/:id/toggle', protect, adminOnly, toggleScheme);

module.exports = router;
