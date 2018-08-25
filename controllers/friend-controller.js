const HttpStatus = require('http-status-codes');
const User = require('../models/user-model');

module.exports = {
  FollowUser(req, res) {
    const followUser = async () => {
      await User.update(
        {
          _id: req.user._id,
          'following.followedUser': { $ne: req.body.followedUser }
        },
        {
          $push: {
            following: {
              followedUser: req.body.followedUser
            }
          }
        }
      );
      await User.update(
        {
          _id: req.body.followedUser,
          'following.follower': { $ne: req.user._id }
        },
        {
          $push: {
            followers: {
              follower: req.user._id
            },
            notifications: {
              senderId: req.user._id,
              message: `${req.user.username} is now following you`,
              created: new Date(),
              viewProfile: false
            }
          }
        }
      );
    };
    followUser()
      .then(() => {
        res.status(HttpStatus.OK).json({ message: 'following user now' });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },
  UnFollowUser(req, res) {
    const unfollowUser = async () => {
      await User.update(
        {
          _id: req.user._id
        },
        {
          $pull: {
            following: {
              followedUser: req.body.unfollowUser
            }
          }
        }
      );
      await User.update(
        {
          _id: req.body.unfollowUser
        },
        {
          $pull: {
            followers: {
              follower: req.user._id
            }
          }
        }
      );
    };
    unfollowUser()
      .then(() => {
        res.status(HttpStatus.OK).json({ message: 'unfollowing user now' });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },
  async markNotification(req, res) {
    if (!req.body.del) {
      await User.updateOne(
        {
          _id: req.user._id,
          'notifications._id': req.params.id
        },
        {
          $set: {
            'notifications.$.read': true
          }
        }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: 'marked as read' });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured' });
        });
    } else {
      await User.update(
        {
          _id: req.user._id,
          'notifications._id': req.params.id
        },
        {
          $pull: {
            notifications: {
              _id: req.params.id
            }
          }
        }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: 'deleted successfully' });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured' });
        });
    }
  },
  async markAllNotification(req, res) {
    await User.update(
      {
        _id: req.user._id
      },
      {
        $set: {
          'notifications.$[elem].read': true
        }
      },
      { arrayFilters: [{ 'elem.read': false }], multi: true }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({ message: 'marked all successfully' });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  }
};
