const express = require('express');
const router = express.Router();

const PostController = require('../controllers/post-controller');
const AuthHelper = require('../helpers/auth-helper');

router.post('/post/add-post', AuthHelper.verifyToken, PostController.addPost);
router.get('/post/:id', AuthHelper.verifyToken, PostController.getPost);
router.get('/posts', AuthHelper.verifyToken, PostController.getAllPost);
router.post('/post/add-like', AuthHelper.verifyToken, PostController.addLike);
router.post(
  '/post/add-comment',
  AuthHelper.verifyToken,
  PostController.addComment
);

module.exports = router;
