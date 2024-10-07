const { initialGreeting, generateAIResponse } = require('../services/chatService');
const { saveMessageToSession, updateSession } = require('../services/sessionService');

const resetChat = async (req, res) => {
  const sessionId = req.sessionID; // get session ID

  // Update MongoDB session data (endTime) when resetting chat
  await updateSession(sessionId, { endTime: new Date() });

  req.session.chatHistory = [];
  req.session.responseCounter = 0;  // Reset the response counter
  req.session.lastAiResponse = null;

  res.json({ message: "Chat has been successfully reset." });
};

const getQuestion = (req, res) => {
  const chatHistory = req.session.chatHistory || [];

  if (chatHistory.length === 0) {
    res.json({
      lastResponse: initialGreeting,
    });
  } else {
    const lastResponse = req.session.lastAiResponse || initialGreeting;
    const isDone = req.session.isDone;
    res.json({
      lastResponse: lastResponse,
      chatHistory: chatHistory,
      isDone: isDone
    });
  }
};

const getGeminiNewResponseOrEndChat = async (req, res) => {
  try {
    const sessionId = req.sessionID; // get session ID
    const chatHistory = req.session.chatHistory || [];
    const responseCounter = req.session.responseCounter || 0; // Tracking the response counter

    const newResponse = await generateAIResponse(chatHistory);

    req.session.responseCounter++;  // Increment the response count
    req.session.lastAiResponse = newResponse;
    await updateSession(sessionId,{lastAiResponse: newResponse});
   // await saveMessageToSession(sessionId, { role: 'Bot', message: newResponse });

    if (responseCounter >= 2) {
      const endMessage = "Thank you for the chat! See you next time!";
      req.session.lastAiResponse = newResponse + " " + endMessage;
      req.session.isDone = true;

      // Mark session end time in MongoDB
      await updateSession(sessionId, { endTime: new Date() });

      res.json({
        nextMessage: newResponse + " " + endMessage,
        isDone: true,
        message: "The chat has ended.",
      });
    } else {
      res.json({
        nextMessage: newResponse,
        responseCounter: req.session.responseCounter,
      });
    }
  } catch (error) {
    console.error("Error during Gemini API call:", error);
    res.status(500).json({ message: "Error during Gemini API call" });
  }
};

const saveAnswer = async (req, res) => {
  const { answer } = req.body;
  const sessionId = req.sessionID; // get session ID

  req.session.chatHistory = req.session.chatHistory || [];
  const lastMessage = req.session.lastAiResponse || initialGreeting;

  req.session.chatHistory.push({ role: 'Bot', message: lastMessage });
  req.session.chatHistory.push({ role: 'User', message: answer });

  // Save Bot and User messages to MongoDB session
  await saveMessageToSession(sessionId, { role: 'Bot', message: lastMessage });
  await saveMessageToSession(sessionId, { role: 'User', message: answer });

  await getGeminiNewResponseOrEndChat(req, res);
};

module.exports = { getQuestion, saveAnswer, resetChat };
