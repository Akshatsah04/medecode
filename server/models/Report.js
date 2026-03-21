const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  simplifiedExplanation: {
    type: String,
    required: true,
  },
  abnormalValues: [
    {
      name: String,
      value: String,
      normalRange: String,
      status: String, // High/Low/Normal/Borderline
    }
  ],
  suggestions: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);
