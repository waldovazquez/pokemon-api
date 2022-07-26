require('dotenv').config();
const jwt = require('jsonwebtoken');
const debug = require('debug')('middleware:auth');

exports.adminAuth = (req, res, next) => {
  debug('adminAuth called');
  const authorization = req.get('authorization');
  let token = null;
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          message: 'Not authorized',
        });
      }
      if (decodedToken.role.toLowerCase() !== 'admin') {
        return res.status(401).json({
          message: 'Not authorized',
        });
      }
      next();
    });
  } else {
    return res.status(401).json({
      message: 'Not authorized, token not available',
    });
  }
  return null;
};

exports.userAuth = (req, res, next) => {
  debug('userAuth called');
  const authorization = req.get('authorization');

  let token = null;
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          message: 'Not authorized',
        });
      }
      if (decodedToken.role.toLowerCase() !== 'basic' && decodedToken.role.toLowerCase() !== 'admin') {
        return res.status(401).json({
          message: 'Not authorized',
        });
      }
      next();
    });
  } else {
    return res.status(401).json({
      message: 'Not authorized, token not available',
    });
  }
  return null;
};
