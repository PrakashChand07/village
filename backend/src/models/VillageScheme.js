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

const villageSchemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    benefit: {
      type: String,
      required: [true, 'Benefit is required'],
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    applyLink: {
      type: String,
      default: '#',
    },
    blocks: {
      type: [blockSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VillageScheme', villageSchemeSchema);
