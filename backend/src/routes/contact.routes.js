const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAdminContacts,
  markAsRead,
  deleteContact
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route to submit a contact message
router.post('/', submitContact);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAdminContacts);
router.patch('/admin/:id/read', protect, adminOnly, markAsRead);
router.delete('/admin/:id', protect, adminOnly, deleteContact);

module.exports = router;
