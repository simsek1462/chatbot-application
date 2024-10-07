const Session = require('../models/sessionModel'); // MongoDB Session model

const saveMessageToSession = async (sessionId, message) => {
  await Session.findOneAndUpdate(
    { sessionId },
    {
      $push: {
        chatHistory: {
          role: message.role,
          message: message.message,
          timestamp: message.timestamp || new Date()
        }
      }
    },
    { upsert: true }
  );
};

const updateSession = async (sessionId, data) => {
  await Session.updateOne({ sessionId }, data);
};

module.exports = {
  saveMessageToSession,
  updateSession,
};
