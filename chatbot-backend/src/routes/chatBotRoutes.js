const express = require('express');
const { getQuestion, saveAnswer, getSessionData, getInitialQuestion, resetChat } = require('../controllers/chatBotController');
const router = express.Router();

router.get('/question', getQuestion);
router.post('/answer', saveAnswer);
router.post('/reset', resetChat);

module.exports = router;
