const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getPublicJobs, getPublicJobById,
  getAllJobs, createJob, updateJob, deleteJob, toggleJob
} = require('../controllers/jobController');

// Public routes
router.get('/', getPublicJobs);
router.get('/:id', getPublicJobById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllJobs);
router.post('/admin', protect, adminOnly, createJob);
router.put('/admin/:id', protect, adminOnly, updateJob);
router.delete('/admin/:id', protect, adminOnly, deleteJob);
router.patch('/admin/:id/toggle', protect, adminOnly, toggleJob);

module.exports = router;
