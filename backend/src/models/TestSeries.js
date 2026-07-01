const mongoose = require('mongoose');

const testSeriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['SSC', 'Banking', 'UPSC', 'Railway', 'State PCS', 'Police', 'Defence', 'Other'],
      default: 'Other',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    price: {
      type: Number,
      default: 499,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    image: {
      type: String,
      default: '',
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

// Auto-set isFree if price is 0
testSeriesSchema.pre('save', function () {
  if (this.price === 0) this.isFree = true;
});

module.exports = mongoose.model('TestSeries', testSeriesSchema);
