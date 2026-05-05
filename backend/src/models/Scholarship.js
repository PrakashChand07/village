const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    amount: {
      type: String,
      required: [true, 'Amount is required'],
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility is required'],
    },
    deadline: {
      type: String,
      required: [true, 'Deadline is required'],
    },
    provider: {
      type: String,
      required: [true, 'Provider is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    applicants: {
      type: String,
      default: '0',
    },
    applyLink: {
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

module.exports = mongoose.model('Scholarship', scholarshipSchema);
