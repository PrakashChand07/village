const mongoose = require('mongoose');

const governmentJobSchema = new mongoose.Schema(
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
    posts: {
      type: String,
      required: [true, 'Number of posts is required'],
    },
    lastDate: {
      type: String,
      required: [true, 'Last date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    salary: {
      type: String,
      required: [true, 'Salary is required'],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
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
  { timestamps: true, suppressReservedKeysWarning: true }
);

module.exports = mongoose.model('GovernmentJob', governmentJobSchema);
