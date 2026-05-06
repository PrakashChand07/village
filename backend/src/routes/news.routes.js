const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getPublicNews, getPublicNewsById,
  getAllNews, createNews, updateNews, deleteNews, toggleNews
} = require('../controllers/newsController');

// Public routes
router.get('/', getPublicNews);
router.get('/:id', getPublicNewsById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllNews);
router.post('/admin', protect, adminOnly, createNews);
router.put('/admin/:id', protect, adminOnly, updateNews);
router.delete('/admin/:id', protect, adminOnly, deleteNews);
router.patch('/admin/:id/toggle', protect, adminOnly, toggleNews);

module.exports = router;
