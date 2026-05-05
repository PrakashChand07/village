const express = require('express');
const router = express.Router();
const { register, login, getMe, changePassword } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, adminOnly, getMe);
router.put('/change-password', protect, adminOnly, changePassword);

module.exports = router;
