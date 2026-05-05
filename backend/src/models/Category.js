const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['job', 'result', 'scholarship', 'scheme'],
    default: 'job'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
