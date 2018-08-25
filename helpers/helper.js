const User = require('../models/user-model');
module.exports = {
  FirstLetterUpperCase: username => {
    const name = username.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  },
  LowerCase: str => {
    return str.toLowerCase();
  },
  updateChatList: async (req, val) => {
    await User.update(
      {
        _id: req.user._id
      },
      {
        $pull: {
          chatList: { receiverId: req.params.receiver_id }
        }
      }
    );
    await User.update(
      {
        _id: req.params.receiver_id
      },
      {
        $pull: {
          chatList: { receiverId: req.user._id }
        }
      }
    );
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
  }
};
