const joi = require('joi');
const httpStatus = require('http-status-codes');
const Post = require('../models/post-model');
const User = require('../models/user-model');

module.exports = {
  addPost(req, res) {
    const schema = joi.object().keys({
      post: joi.string().required()
    });
    const { error } = joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(httpStatus.BAD_REQUEST).json({ msg: error.details });
    }
    const body = {
      user: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: Date.now()
    };

    Post.create(body)
      .then(async post => {
        await User.update(
          {
            _id: req.user._id
          },
          {
            $push: {
              posts: {
                postId: post._id,
                post: req.body.post,
                created: Date.now()
              }
            }
          }
        );
        res.status(httpStatus.OK).json({ message: 'post created', post });
      })
      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },
  async getAllPost(req, res) {
    try {
      const posts = await Post.find({})
        .populate('user')
        .sort({ created: -1 });
      const top = await Post.find({ totalLikes: { $gte: 2 } })
        .populate('user')
        .sort({ created: -1 });

      return res
        .status(httpStatus.OK)
        .json({ message: 'All post', posts, top });
    } catch (err) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error Occured' });
    }
  },
  async addLike(req, res) {
    const postId = req.body._id;
    await Post.update(
      {
        _id: postId,
        'likes.username': { $ne: req.user.username }
      },
      {
        $push: {
          likes: {
            username: req.user.username
          }
        },
        $inc: {
          totalLikes: 1
        }
      }
    )
      .then(() => {
        res.status(httpStatus.OK).json({ message: 'you liked the post' });
      })
      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },
  async addComment(req, res) {
    const postId = req.body.postId;
    await Post.update(
      {
        _id: postId
      },
      {
        $push: {
          comments: {
            userId: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
            createdAt: Date.now()
          }
        }
      }
    )
      .then(() => {
        res.status(httpStatus.OK).json({ message: 'you liked the post' });
      })
      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },
  async getPost(req, res) {
    await Post.findOne({ _id: req.params.id })
      .populate('user')
      .populate('comments.userId')
      .then(post => {
        res.status(httpStatus.OK).json({ message: 'post found', post });
      })
      .catch(err => {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: 'post not found', post });
      });
  }
};
