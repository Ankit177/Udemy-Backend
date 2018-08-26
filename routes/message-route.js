const express = require('express');
const router = express.Router();

const MessageController = require('../controllers/message-controller');
const AuthHelper = require('../helpers/auth-helper');

router.post(
  '/chat-messages/:sender_id/:receiver_id',
  AuthHelper.verifyToken,
  MessageController.sendMessage
);

router.get(
  '/chat-messages/:sender_id/:receiver_id',
  AuthHelper.verifyToken,
  MessageController.getAllMessages
);

router.get(
  '/receiver-messages/:sender/:receiver',
  AuthHelper.verifyToken,
  MessageController.MarkReceiverMessages
);
module.exports = router;
