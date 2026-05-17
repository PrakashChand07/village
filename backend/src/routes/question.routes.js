const express = require('express');
const router = express.Router();
const {
  getQuestionsForTest,
  getQuestionsAdmin,
  addQuestion,
  bulkAddQuestions,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/auth');
const { protectUser } = require('../middleware/userAuth');

// User route (no correct answers)
router.get('/test/:testId', protectUser, getQuestionsForTest);

// Admin routes
router.get('/admin/test/:testId', protect, adminOnly, getQuestionsAdmin);
router.post('/', protect, adminOnly, addQuestion);
router.post('/bulk', protect, adminOnly, bulkAddQuestions);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;
