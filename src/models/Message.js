const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound'],
      required: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'template', 'status'],
      default: 'text',
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    content: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed', 'received'],
      default: 'sent',
    },
    providerMessageId: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
