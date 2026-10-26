const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    whatsappId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'archived'],
      default: 'open',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Conversation', conversationSchema);
