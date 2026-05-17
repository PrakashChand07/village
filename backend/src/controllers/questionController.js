const Question = require('../models/Question');
const Test = require('../models/Test');

// Helper: update test totals after question change
const updateTestTotals = async (testId) => {
  const questions = await Question.find({ test: testId });
  const totalQuestions = questions.length;
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  await Test.findByIdAndUpdate(testId, { totalQuestions, totalMarks });
};

// @desc    Get questions for a test (user - without correctAnswer/explanation)
// @route   GET /api/questions/test/:testId
const getQuestionsForTest = async (req, res) => {
  try {
    const questions = await Question.find({ test: req.params.testId })
      .select('-correctAnswer -explanation') // hide during test
      .sort({ questionNumber: 1 });
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get questions WITH answers (for admin and post-test review)
// @route   GET /api/questions/admin/test/:testId
const getQuestionsAdmin = async (req, res) => {
  try {
    const questions = await Question.find({ test: req.params.testId }).sort({ questionNumber: 1 });
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add a single question (admin)
// @route   POST /api/questions
const addQuestion = async (req, res) => {
  try {
    const { test, questionText, options, correctAnswer, explanation, marks, negativeMarks, subject } = req.body;

    // Auto-assign question number
    const existingCount = await Question.countDocuments({ test });
    const question = await Question.create({
      test,
      questionNumber: existingCount + 1,
      questionText,
      options,
      correctAnswer,
      explanation: explanation || '',
      marks: marks || 1,
      negativeMarks: negativeMarks !== undefined ? negativeMarks : 0.25,
      subject: subject || 'General',
    });

    await updateTestTotals(test);

    res.status(201).json({ success: true, message: 'Question added', data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add multiple questions at once (admin)
// @route   POST /api/questions/bulk
const bulkAddQuestions = async (req, res) => {
  try {
    const { testId, questions } = req.body;
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions provided' });
    }

    let existingCount = await Question.countDocuments({ test: testId });
    const questionsToInsert = questions.map((q, idx) => ({
      test: testId,
      questionNumber: existingCount + idx + 1,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      marks: q.marks || 1,
      negativeMarks: q.negativeMarks !== undefined ? q.negativeMarks : 0.25,
      subject: q.subject || 'General',
    }));

    const inserted = await Question.insertMany(questionsToInsert);
    await updateTestTotals(testId);

    res.status(201).json({ success: true, message: `${inserted.length} questions added`, data: inserted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update question (admin)
// @route   PUT /api/questions/:id
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    await updateTestTotals(question.test);
    res.status(200).json({ success: true, message: 'Question updated', data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete question (admin)
// @route   DELETE /api/questions/:id
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    // Re-number remaining questions
    const remaining = await Question.find({ test: question.test }).sort({ questionNumber: 1 });
    await Promise.all(remaining.map((q, idx) => Question.findByIdAndUpdate(q._id, { questionNumber: idx + 1 })));

    await updateTestTotals(question.test);
    res.status(200).json({ success: true, message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getQuestionsForTest, getQuestionsAdmin, addQuestion, bulkAddQuestions, updateQuestion, deleteQuestion };
