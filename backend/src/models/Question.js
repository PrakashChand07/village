const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: [true, 'Test reference is required'],
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function (v) {
          return v.length === 4;
        },
        message: 'Exactly 4 options are required',
      },
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
    marks: {
      type: Number,
      default: 1,
    },
    negativeMarks: {
      type: Number,
      default: 0.25,
    },
    subject: {
      type: String,
      default: 'General',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
