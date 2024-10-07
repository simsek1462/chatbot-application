const { runPrompt } = require('./aiService');
const { saveMessageToSession } = require('./sessionService');

const initialGreeting = "What is your favorite breed of cat, and why?";

const getChatPrompt = (chatHistory) => {
  return chatHistory.map(item => {
    return `${item.role === 'User' ? 'User Message' : 'Your Message'}: ${item.message}`;
  }).join('\n');
};

const generateAIResponse = async (chatHistory) => {
    const formattedChatHistory=getChatPrompt(chatHistory);
  const prompt = `I am developing a chatbot application. You are the bot in this application and the user is chatting with you. The chat history is as follows:
${formattedChatHistory}Review the chat history and provide a natural response. Also, generate a new question to continue the conversation with the user.
Remember, instead of querying the history, respond directly. Keep in mind that I will show the response you return directly to the user, so your response should be pure and must not contain tags or special characters.`;

  return await runPrompt(prompt);
};

module.exports = {
  initialGreeting,
  generateAIResponse,
};
