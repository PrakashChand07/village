const express = require('express');
const router = express.Router();
const {
  submitAttempt,
  getAttemptById,
  getUserAttempts,
  getAttemptsByTest,
  getAllUsersAdmin,
} = require('../controllers/attemptController');
const { protect, adminOnly } = require('../middleware/auth');
const { protectUser } = require('../middleware/userAuth');

// User routes
router.post('/', protectUser, submitAttempt);
router.get('/me', protectUser, getUserAttempts);
router.get('/:id', protectUser, getAttemptById);

// Admin routes
router.get('/admin/test/:testId', protect, adminOnly, getAttemptsByTest);
router.get('/admin/users', protect, adminOnly, getAllUsersAdmin);

module.exports = router;
