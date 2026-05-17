const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.USER_JWT_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.USER_JWT_EXPIRES_IN || '30d',
  });
};

// @desc    Register Student & Send OTP
// @route   POST /api/user/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, phone and password' });
    }

    if (phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number' });
    }

    const userExists = await User.findOne({ email });
    
    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
      } else {
        // User exists but not verified - update password and resend OTP
        userExists.name = name;
        userExists.phone = phone;
        userExists.password = password;
        await userExists.save();

        await sendEmail({ email, emailType: "VERIFY", userId: userExists._id });
        return res.status(200).json({ success: true, requiresOTP: true, message: 'OTP sent to your email.' });
      }
    }

    const user = await User.create({ name, email, phone, password, isVerified: false });
    
    // Send email asynchronously
    await sendEmail({ email, emailType: "VERIFY", userId: user._id })
        .catch(err => console.error("Email send error:", err));

    res.status(201).json({
      success: true,
      requiresOTP: true,
      message: 'OTP sent to your email. Please verify.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Verify Email OTP
// @route   POST /api/user/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ 
      email, 
      verifyToken: otp,
      verifyTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Login Student
// @route   POST /api/user/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      // Auto-resend OTP and tell them to verify
      await sendEmail({ email, emailType: "VERIFY", userId: user._id });
      return res.status(403).json({ success: false, requiresOTP: true, message: 'Please verify your email to login. A new OTP has been sent.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/user/auth/me
// @access  Private (User)
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
    },
  });
};

module.exports = { register, verifyOTP, login, getMe };
