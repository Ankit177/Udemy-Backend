const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');
const httpStatus = require('http-status-codes');
module.exports = {
  verifyToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: 'No authorization' });
    }
    const token = req.cookies.auth || req.headers.authorization.split(' ')[1];
    if (!token) {
      res.status(httpStatus.FORBIDDEN).json({ message: 'No token Provided' });
    }
    return jwt.verify(token, dbConfig.secret, (err, decoded) => {
      if (err) {
        if (err.expiredAt < new Date()) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Token has expired,please login again',
            token: null
          });
        }
        next();
      }
      req.user = decoded.data;
      next();
    });
  }
};
