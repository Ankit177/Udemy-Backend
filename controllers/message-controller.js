const HttpStatus = require('http-status-codes');

const User = require('../models/user-model');
const Message = require('../models/message-model');
const Conversation = require('../models/conversation-model');
const helper = require('../helpers/helper');

module.exports = {
  async getAllMessages(req, res) {
    const { sender_id, receiver_id } = req.params;
    const conversation = await Conversation.findOne({
      $or: [
        {
          $and: [
            {
              'participants.senderId': sender_id
            },
            {
              'participants.receiverId': receiver_id
            }
          ]
        },
        {
          $and: [
            {
              'participants.senderId': receiver_id
            },
            {
              'participants.receiverId': sender_id
            }
          ]
        }
      ]
    }).select('_id');

    if (conversation) {
      const messages = await Message.findOne({
        conversationId: conversation._id
      });
      res.status(HttpStatus.OK).json({ message: 'message returned', messages });
    }
  },
  sendMessage(req, res) {
    const { sender_id, receiver_id } = req.params;
    Conversation.find(
      {
        $or: [
          {
            participants: {
              $elemMatch: { senderId: sender_id, receiverId: receiver_id }
            }
          },
          {
            participants: {
              $elemMatch: { senderId: receiver_id, receiverId: sender_id }
            }
          }
        ]
      },
      async (err, result) => {
        if (result.length > 0) {
          const message = await Message.findOne({
            conversationId: result[0]._id
          });
          helper.updateChatList(req, message);
          await Message.update(
            {
              conversationId: result[0]._id
            },
            {
              $push: {
                message: {
                  senderId: req.user._id,
                  receiverId: req.params.receiver_id,
                  sendername: req.user.username,
                  receivername: req.body.receiver_name,
                  messageBody: req.body.message
                }
              }
            }
          )
            .then(() => {
              res
                .status(HttpStatus.OK)
                .json({ message: 'message sent successfully' });
            })
            .catch(() => {
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'error occurred'
              });
            });
        } else {
          const newConversation = new Conversation();
          newConversation.participants.push({
            senderId: req.user._id,
            receiverId: req.params.receiver_id
          });

          const saveConversation = await newConversation.save();

          const newMessage = new Message();
          newMessage.conversationId = saveConversation._id;
          newMessage.sender = req.user.username;
          newMessage.receiver = req.body.receiver_name;
          newMessage.message.push({
            senderId: req.user._id,
            receiverId: req.params.receiver_id,
            sendername: req.user.username,
            receivername: req.body.receiver_name,
            messageBody: req.body.message
          });

          await User.update(
            {
              _id: req.user._id
            },
            {
              $push: {
                chatList: {
                  $each: [
                    {
                      receiverId: req.params.receiver_id,
                      msgId: newMessage._id
                    }
                  ],
                  $position: 0
                }
              }
            }
          );
          await User.update(
            {
              _id: req.params.receiver_id
            },
            {
              $push: {
                chatList: {
                  $each: [
                    {
                      receiverId: req.user._id,
                      msgId: newMessage._id
                    }
                  ],
                  $position: 0
                }
              }
            }
          );

          await newMessage
            .save()
            .then(() => {
              res.status(HttpStatus.OK).json({ message: 'message sent ' });
            })
            .catch(err => {
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                {
                  message: 'error occurred'
                },
                err
              );
            });
        }
      }
    );
  }
};
