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

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    source: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);
