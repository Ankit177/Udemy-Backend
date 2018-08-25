const joi = require('joi');
const httpStatus = require('http-status-codes');
const User = require('../models/user-model');
const Helper = require('../helpers/helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');

module.exports = {
  async createUser(req, res) {
    const schema = joi.object().keys({
      username: joi
        .string()
        .min(5)
        .max(10)
        .required(),
      email: joi
        .string()
        .email()
        .required(),
      password: joi
        .string()
        .min(5)
        .required()
    });
    const { error, value } = joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(httpStatus.BAD_REQUEST).json({ msg: error.details });
    }
    const userEmail = await User.findOne({
      email: Helper.LowerCase(req.body.email)
    });
    if (userEmail) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: 'Email already exists' });
    }
    const userName = await User.findOne({
      username: Helper.FirstLetterUpperCase(req.body.username)
    });
    if (userName) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: 'Username already exists' });
    }
    return bcrypt.hash(value.password, 10, (error, hash) => {
      if (error) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: 'error hashing password' });
      }
      const body = {
        username: Helper.FirstLetterUpperCase(value.username),
        email: Helper.LowerCase(value.email),
        password: hash
      };
      User.create(body)
        .then(user => {
          const token = jwt.sign({ data: user }, dbConfig.secret, {
            expiresIn: '1h'
          });
          res.cookie('auth', token);
          res
            .status(httpStatus.CREATED)
            .json({ message: 'user created successfully', user, token });
        })
        .catch(err => {
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error Creating User' });
        });
    });
  },
  async login(req, res) {
    if (!req.body.username || !req.body.password) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'No empty fields allowed here' });
    }
    await User.findOne({
      username: Helper.FirstLetterUpperCase(req.body.username)
    })
      .then(user => {
        if (!user) {
          return res
            .status(httpStatus.NOT_FOUND)
            .json({ message: `username doesn't exists` });
        }

        return bcrypt.compare(req.body.password, user.password).then(result => {
          if (!result) {
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: 'password is incorrect' });
          } else {
            const token = jwt.sign({ data: user }, dbConfig.secret, {
              expiresIn: '1h'
            });
            res.cookie('auth', token);
            return res
              .status(httpStatus.OK)
              .json({ message: 'login successful', user, token });
          }
        });
      })
      .catch(err => {
        if (err) {
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error Occurred' });
        }
      });
  }
};
