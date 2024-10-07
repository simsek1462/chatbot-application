const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  lastAiResponse : {type: String},
  chatHistory: [
    {
      role: { type: String, enum: ['User', 'Bot'], required: true },
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
});

module.exports = mongoose.model('Session', sessionSchema);
