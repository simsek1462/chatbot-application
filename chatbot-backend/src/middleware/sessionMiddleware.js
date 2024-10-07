const Session = require('../models/sessionModel');

const sessionMiddleware = async (req, res, next) => {
  if (!req.session.chatHistory) {
    req.session.chatHistory = [];

    // Check if session already exists in MongoDB, if not create a new one
    const existingSession = await Session.findOne({ sessionId: req.sessionID });

    if (!existingSession) {
      // Create new session with start time
      await Session.create({
        sessionId: req.sessionID,
        chatHistory: [],
        startTime: new Date() // Save the start time when the session is first created
      });
    }
  }
  next();
};

module.exports = sessionMiddleware;
