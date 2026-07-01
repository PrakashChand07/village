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
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);
