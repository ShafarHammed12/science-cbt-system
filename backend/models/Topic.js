const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Topic title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  className: {
    type: String,
    enum: ['JSS1', 'JSS2', 'JSS3'],
    required: true
  },
  order: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Topic', topicSchema);
