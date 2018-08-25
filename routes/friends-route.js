const express = require('express');
const router = express.Router();

const FriendController = require('../controllers/friend-controller');
const AuthHelper = require('../helpers/auth-helper');

router.post(
  '/follow-user',
  AuthHelper.verifyToken,
  FriendController.FollowUser
);
router.post(
  '/unfollow-user',
  AuthHelper.verifyToken,
  FriendController.UnFollowUser
);
router.post(
  '/mark/:id',
  AuthHelper.verifyToken,
  FriendController.markNotification
);
router.post(
  '/mark-all',
  AuthHelper.verifyToken,
  FriendController.markAllNotification
);
module.exports = router;
