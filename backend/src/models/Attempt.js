const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    testSeries: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestSeries',
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        selectedOption: {
          type: Number,
          default: null, // null means skipped
        },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    wrongAnswers: {
      type: Number,
      default: 0,
    },
    unanswered: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    timeTaken: {
      type: Number,
      default: 0, // in seconds
    },
    subjectWisePerformance: [
      {
        subject: String,
        correct: Number,
        wrong: Number,
        unanswered: Number,
        accuracy: Number,
      },
    ],
    // Detailed per-question review data
    questionReview: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        questionText: String,
        options: [String],
        selectedOption: Number,
        correctAnswer: Number,
        explanation: String,
        marks: Number,
        negativeMarks: Number,
        subject: String,
        isCorrect: Boolean,
        isSkipped: Boolean,
        marksObtained: Number,
      },
    ],
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attempt', attemptSchema);
