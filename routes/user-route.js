const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user-controller');
const AuthHelper = require('../helpers/auth-helper');

router.get('/users', AuthHelper.verifyToken, UserController.getAllUser);
router.get('/user/:id', AuthHelper.verifyToken, UserController.getUserById);
router.get(
  '/users/:username',
  AuthHelper.verifyToken,
  UserController.getUserByName
);

module.exports = router;
