const express = require('express');
const { getConversations, getConversationMessages } = require('../controllers/conversationController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getConversations);
router.get('/:conversationId/messages', authMiddleware, getConversationMessages);

module.exports = router;
