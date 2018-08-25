const User = require('../models/user-model');
const HttpStatus = require('http-status-codes');
module.exports = {
  async getAllUser(req, res) {
    await User.find({})
      .populate('posts.postId')
      .populate('following.followedUser')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .then(result => {
        res.status(HttpStatus.OK).json({ message: 'users', result });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'error occurred' });
      });
  },
  async getUserById(req, res) {
    await User.findOne({ _id: req.params.id })
      .populate('posts.postId')
      .populate('following.followedUser')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .then(result => {
        res.status(HttpStatus.OK).json({ message: 'user by id', result });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'error occurred' });
      });
  },
  async getUserByName(req, res) {
    await User.findOne({ username: req.params.username })
      .populate('posts.postId')
      .populate('following.followedUser')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .then(result => {
        res.status(HttpStatus.OK).json({ message: 'users', result });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'error occurred' });
      });
  }
};
