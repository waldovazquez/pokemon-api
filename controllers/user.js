require('dotenv').config();
const debug = require('debug')('controllers:user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.register = async (req, res) => {
  debug('register called');
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      avatar,
    } = req.body;

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password less than 6 characters',
      });
    }

    const userByEmail = await User.findOne({ email });

    if (userByEmail) {
      return res.status(200).json({
        message: 'There is already a user with that email',
        ok: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      avatar,
    });

    if (user) {
      return res.status(200).json({
        message: 'User Successfully Created',
        userId: user._id,
        ok: true,
      });
    }
  } catch (e) {
    console.info('Error', e);
    res.status(400).json({
      message: 'User Not Successful Created',
    });
  }
  return null;
};

exports.login = async (req, res) => {
  debug('login called');
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email or Password not present',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Login Not Successful',
      });
    }

    const responseCompare = await bcrypt.compare(password, user.password);
    if (responseCompare) {
      const token = jwt.sign(
        {
          id: user._id,
          email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: (60 * 60) * 3,
        },
      );

      return res.status(201).json({
        message: 'User Successfully Logged in',
        userId: user._id,
        token,
        ok: true,
      });
    }
    return res.status(400).json({
      message: 'Login Not Succesful',
    });
  } catch (e) {
    res.status(500).json({
      message: 'An error occurred',
    });
  }
  return null;
};

exports.updateRole = async (req, res) => {
  debug('updateRole called');
  try {
    const {
      role,
      id,
    } = req.body;
    if (role && id) {
      if (role === 'admin') {
        const user = await User.findById(id);
        if (user.role !== 'admin') {
          user.role = role;
          user.save((err) => {
            if (err) {
              res.status('400').json({
                message: 'An error occurred',
                error: err.message,
              });
              process.exit(1);
            }
            res.status('201').json({
              message: 'Update Successful',
              user,
            });
          });
        } else {
          res.status(400).json({
            message: 'User is already an Admin',
          });
        }
      }
    }
  } catch (e) {
    console.info('Error', e);
    res.status(400).json({
      message: 'An error occurred',
      error: e.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  debug('updateUser called');
  try {
    const {
      firstName,
      lastName,
      email,
      avatar,
      currentPassword,
      password,
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        error: 'User Not Found',
      });
    }

    const token = req.get('authorization').substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken) {
      if (currentPassword && password) {
        const resultCompareEqualPassword = await bcrypt.compare(password, user.password);
        if (resultCompareEqualPassword) {
          return res.status(200).json({
            message: 'The passwords are equal',
            ok: false,
          });
        }

        const resultCompare = await bcrypt.compare(currentPassword, user.password);

        if (resultCompare) {
          const resultHash = await bcrypt.hash(password, 10);
          if (resultHash) {
            const responseUpdate = await User.findOneAndUpdate({
              _id: decodedToken.id,
            }, {
              firstName,
              lastName,
              email,
              avatar,
              password: resultHash,
            });

            if (responseUpdate) {
              return res.status(200).json({
                message: 'User Successfully Updated',
                ok: true,
              });
            }
          }
        } else {
          res.status(400).json({
            error: 'Something is wrong',
          });
        }
      } else {
        const resultUpdate = await User.findOneAndUpdate({
          _id: decodedToken.id,
        }, {
          firstName,
          lastName,
          email,
          avatar,
        });
        if (resultUpdate) {
          return res.status(200).json({
            message: 'User Successfully Updated',
            ok: true,
          });
        }
      }
    }
  } catch (e) {
    console.info('Error', e);
    res.status(500).json({
      message: 'An error occurred',
    });
  }
  return null;
};

exports.deleteUser = async (req, res) => {
  debug('deleteUser called');
  try {
    const {
      id,
    } = req.body;

    const user = await User.findById(id);

    if (user) {
      const userRemove = await user.remove();
      if (userRemove) {
        return res.status(201).json({
          message: 'User successfully deleted',
          userRemove,
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      message: 'An error occurred',
    });
  }
  return null;
};

exports.getByToken = async (req, res) => {
  debug('getByToken called');
  try {
    const token = req.get('authorization').substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken) {
      const user = await User.findOne({ _id: decodedToken.id });

      if (user) {
        const responseUser = user.toObject();
        delete responseUser.password;
        delete responseUser.role;
        return res.status(200).json({
          userData: responseUser,
          ok: true,
        });
      }
    } else {
      return res.status(401).json({
        message: 'Not authorized, token not available',
      });
    }
  } catch (e) {
    console.info('Error', e);
    res.status(500).json({
      message: 'An error occurred',
    });
  }
  return null;
};
