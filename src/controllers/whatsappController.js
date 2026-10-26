const crypto = require('crypto');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const WHATSAPP_API_BASE = 'https://graph.facebook.com';

const sendWhatsAppRequest = async (payload) => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp API credentials are not configured.');
  }

  const url = `${WHATSAPP_API_BASE}/${process.env.WHATSAPP_API_VERSION || 'v18.0'}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'WhatsApp request failed.');
  }

  return response.json();
};

const sendTextMessage = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ message: 'Receiver and message text are required.' });
    }

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body: message,
      },
    };

    const response = await sendWhatsAppRequest(payload);

    let conversation = await Conversation.findOne({ phoneNumber: to });

    if (!conversation) {
      conversation = await Conversation.create({
        user: req.user.id,
        phoneNumber: to,
        whatsappId: to,
      });
    }

    await Message.create({
      conversation: conversation._id,
      user: req.user.id,
      direction: 'outbound',
      messageType: 'text',
      content: message,
      status: 'sent',
      providerMessageId: response?.messages?.[0]?.id || '',
      payload,
      metadata: { providerResponse: response },
    });

    return res.status(200).json({
      message: 'WhatsApp text message sent successfully.',
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to send WhatsApp message.', error: error.message });
  }
};

const sendTemplateMessage = async (req, res) => {
  try {
    const { to, templateName, languageCode = 'en', components = [] } = req.body;

    if (!to || !templateName) {
      return res.status(400).json({ message: 'Phone number and template name are required.' });
    }

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    };

    const response = await sendWhatsAppRequest(payload);

    let conversation = await Conversation.findOne({ phoneNumber: to });
    if (!conversation) {
      conversation = await Conversation.create({
        user: req.user.id,
        phoneNumber: to,
        whatsappId: to,
      });
    }

    await Message.create({
      conversation: conversation._id,
      user: req.user.id,
      direction: 'outbound',
      messageType: 'template',
      content: `Template: ${templateName}`,
      status: 'sent',
      providerMessageId: response?.messages?.[0]?.id || '',
      payload,
      metadata: { providerResponse: response },
    });

    return res.status(200).json({
      message: 'WhatsApp template message sent successfully.',
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to send WhatsApp template message.', error: error.message });
  }
};

const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'webhook-secret';

  if (mode && token && mode === 'subscribe' && token === expectedToken) {
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ message: 'Webhook verification failed.' });
};

const handleWebhook = async (req, res) => {
  try {
    const entries = req.body.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        const value = change.value || {};
        const messages = value.messages || [];

        for (const message of messages) {
          const from = message.from;
          const body = message.text?.body || '';
          const conversationPhone = from;

          let conversation = await Conversation.findOne({ phoneNumber: conversationPhone });
          if (!conversation) {
            const firstUser = await require('../models/User').findOne({ role: 'admin' }).sort({ createdAt: 1 });
            conversation = await Conversation.create({
              user: firstUser ? firstUser._id : req.user?.id || null,
              phoneNumber: conversationPhone,
              whatsappId: from,
            });
          }

          await Message.create({
            conversation: conversation._id,
            user: conversation.user,
            direction: 'inbound',
            messageType: 'text',
            content: body,
            status: 'received',
            payload: message,
            metadata: { provider: 'meta-whatsapp', raw: message },
          });
        }

        const statuses = value.statuses || [];
        for (const status of statuses) {
          const messageId = status.id;
          const statusName = status.status;

          const existingMessage = await Message.findOne({ providerMessageId: messageId });
          if (existingMessage) {
            existingMessage.status = statusName === 'read' ? 'read' : statusName === 'delivered' ? 'delivered' : 'sent';
            await existingMessage.save();
          }
        }
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ message: 'Webhook processing failed.', error: error.message });
  }
};

module.exports = {
  sendTextMessage,
  sendTemplateMessage,
  verifyWebhook,
  handleWebhook,
};
