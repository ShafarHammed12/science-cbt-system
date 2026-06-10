const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required']
  },
  options: {
    type: [String],
    validate: {
      validator: function (v) { return v.length === 4; },
      message: 'Exactly 4 options are required'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);
