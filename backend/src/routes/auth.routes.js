const express = require('express');
const router = express.Router();
const { register, login, getMe, changePassword, getAllUsers, toggleUserStatus, getAllPurchases } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, adminOnly, getMe);
router.put('/change-password', protect, adminOnly, changePassword);

// User & Purchase management routes
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/toggle-status', protect, adminOnly, toggleUserStatus);
router.get('/purchases', protect, adminOnly, getAllPurchases);

module.exports = router;
