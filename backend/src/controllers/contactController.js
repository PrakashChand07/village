const Contact = require('../models/Contact');

// @desc    Submit a contact message (Public)
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !message || (!email && !phone)) {
      return res.status(400).json({ success: false, message: 'Name, Message, and at least one contact method (Email or Phone) are required' });
    }

    const contact = await Contact.create({ name, email, phone, message });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contacts/admin/all
// @access  Private/Admin
const getAdminContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Mark contact message as read (Admin)
// @route   PATCH /api/contacts/admin/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }

    contact.isRead = true;
    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: contact
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contacts/admin/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  submitContact,
  getAdminContacts,
  markAsRead,
  deleteContact
};
