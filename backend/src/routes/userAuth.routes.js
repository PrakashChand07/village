const express = require('express');
const router = express.Router();
const { register, verifyOTP, login, getMe } = require('../controllers/userAuthController');
const { protectUser } = require('../middleware/userAuth');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.get('/me', protectUser, getMe);

module.exports = router;
