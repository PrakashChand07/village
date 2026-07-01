const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['heading', 'text', 'link', 'divider', 'table'],
    required: true,
  },
  value: { type: String, default: '' },
  label: { type: String, default: '' },
  url:   { type: String, default: '' },
  tableData: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

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
    blocks: {
      type: [blockSchema],
      default: [],
    },
    isNewPost: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isImportantUpdate: {
      type: Boolean,
      default: false,
      set: v => v === 'on' ? true : v,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

module.exports = mongoose.model('GovernmentJob', governmentJobSchema);
