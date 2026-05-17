const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const Test = require('../models/Test');
const Purchase = require('../models/Purchase');
const TestSeries = require('../models/TestSeries');

// Helper: check if user has access to a test series
const hasAccess = async (userId, testSeriesId) => {
  const series = await TestSeries.findById(testSeriesId);
  if (!series) return false;
  if (series.isFree) return true;
  const purchase = await Purchase.findOne({ user: userId, testSeries: testSeriesId, status: 'success' });
  return !!purchase;
};

// @desc    Submit a test attempt (auto-scores)
// @route   POST /api/attempts
const submitAttempt = async (req, res) => {
  try {
    const { testId, answers, timeTaken } = req.body;
    // answers: [{ questionId, selectedOption }]

    const test = await Test.findById(testId).populate('testSeries');
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    // Check access
    const access = await hasAccess(req.user._id, test.testSeries._id);
    if (!access) {
      return res.status(403).json({ success: false, message: 'You do not have access to this test series. Please purchase first.' });
    }

    // Load all questions for this test
    const questions = await Question.find({ test: testId }).sort({ questionNumber: 1 });

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    const subjectMap = {};
    const questionReview = [];

    for (const question of questions) {
      const userAnswer = answers.find((a) => a.questionId === question._id.toString());
      const selectedOption = userAnswer ? userAnswer.selectedOption : null;

      let isCorrect = false;
      let isSkipped = selectedOption === null || selectedOption === undefined;
      let marksObtained = 0;

      if (isSkipped) {
        unanswered++;
      } else if (selectedOption === question.correctAnswer) {
        isCorrect = true;
        correctAnswers++;
        marksObtained = question.marks;
        score += question.marks;
      } else {
        wrongAnswers++;
        marksObtained = -question.negativeMarks;
        score -= question.negativeMarks;
      }

      // Subject-wise tracking
      const sub = question.subject || 'General';
      if (!subjectMap[sub]) {
        subjectMap[sub] = { subject: sub, correct: 0, wrong: 0, unanswered: 0, accuracy: 0, total: 0 };
      }
      subjectMap[sub].total++;
      if (isCorrect) subjectMap[sub].correct++;
      else if (isSkipped) subjectMap[sub].unanswered++;
      else subjectMap[sub].wrong++;

      questionReview.push({
        questionId: question._id,
        questionText: question.questionText,
        options: question.options,
        selectedOption,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        marks: question.marks,
        negativeMarks: question.negativeMarks,
        subject: question.subject,
        isCorrect,
        isSkipped,
        marksObtained,
      });
    }

    // Compute subject-wise accuracy
    const subjectWisePerformance = Object.values(subjectMap).map((s) => ({
      ...s,
      accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    }));

    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const accuracy = questions.length > 0
      ? Math.round((correctAnswers / questions.length) * 100)
      : 0;

    const attempt = await Attempt.create({
      user: req.user._id,
      test: testId,
      testSeries: test.testSeries._id,
      answers: answers.map((a) => ({ questionId: a.questionId, selectedOption: a.selectedOption })),
      score: Math.max(0, score), // clamp to 0
      totalMarks,
      correctAnswers,
      wrongAnswers,
      unanswered,
      accuracy,
      timeTaken: timeTaken || 0,
      subjectWisePerformance,
      questionReview,
      completedAt: new Date(),
    });

    // Increment enrolled count
    await TestSeries.findByIdAndUpdate(test.testSeries._id, { $inc: { studentsEnrolled: 1 } });

    res.status(201).json({
      success: true,
      message: 'Test submitted successfully',
      attemptId: attempt._id,
      score: attempt.score,
      accuracy: attempt.accuracy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get a single attempt (full result with review)
// @route   GET /api/attempts/:id
const getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('test', 'title duration')
      .populate('testSeries', 'title category');

    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this attempt' });
    }

    res.status(200).json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all attempts by logged-in user (history)
// @route   GET /api/attempts/me
const getUserAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .populate('test', 'title duration')
      .populate('testSeries', 'title category difficulty')
      .sort({ completedAt: -1 });
    res.status(200).json({ success: true, data: attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all attempts for a test (admin)
// @route   GET /api/attempts/admin/test/:testId
const getAttemptsByTest = async (req, res) => {
  try {
    const attempts = await Attempt.find({ test: req.params.testId })
      .populate('user', 'name email phone')
      .sort({ completedAt: -1 });
    res.status(200).json({ success: true, data: attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all students and stats for admin
// @route   GET /api/attempts/admin/users
const getAllUsersAdmin = async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const attempts = await Attempt.find({ user: u._id });
        const avgScore = attempts.length > 0
          ? Math.round(attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length)
          : 0;
        return { ...u.toObject(), testsTaken: attempts.length, avgScore };
      })
    );
    res.status(200).json({ success: true, data: usersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { submitAttempt, getAttemptById, getUserAttempts, getAttemptsByTest, getAllUsersAdmin };
