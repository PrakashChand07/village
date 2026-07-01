const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    type: {
      type: String,
      required: [true, 'Please add a material type'],
      enum: ['PDF', 'Video', 'Online Test', 'Notes', 'Other'],
      default: 'PDF',
    },
    description: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      required: function() { return this.type === 'PDF' || this.type === 'Notes'; },
    },
    fileSize: {
      type: String,
      default: '0 MB',
    },
    downloads: {
      type: Number,
      default: 0,
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
