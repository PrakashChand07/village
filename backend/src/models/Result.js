const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Result date is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['Declared', 'Awaited', 'Expected Soon'],
      default: 'Awaited',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    resultLink: {
      type: String,
      default: '#',
    },
    downloadLink: {
      type: String,
      default: '#',
    },
    isNewPost: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
