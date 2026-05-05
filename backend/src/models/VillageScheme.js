const mongoose = require('mongoose');

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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VillageScheme', villageSchemeSchema);
