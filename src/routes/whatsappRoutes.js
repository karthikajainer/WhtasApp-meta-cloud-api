const express = require('express');
const {
  sendTextMessage,
  sendTemplateMessage,
  verifyWebhook,
  handleWebhook,
} = require('../controllers/whatsappController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);
router.post('/send-text', authMiddleware, sendTextMessage);
router.post('/send-template', authMiddleware, sendTemplateMessage);

module.exports = router;
