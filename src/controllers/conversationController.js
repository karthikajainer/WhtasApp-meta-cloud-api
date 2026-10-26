const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .populate('user', 'name email')
      .sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch conversations.', error: error.message });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch messages.', error: error.message });
  }
};

module.exports = {
  getConversations,
  getConversationMessages,
};
