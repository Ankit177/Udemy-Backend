const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: String,
  receiver: String,
  message: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      sendername: String,
      receivername: String,
      messageBody: { type: String, default: '' },
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now() }
    }
  ]
});

module.exports = mongoose.model('Message', MessageSchema);
