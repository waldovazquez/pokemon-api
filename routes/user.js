const express = require('express');

const {
  adminAuth,
  userAuth,
} = require('../middleware/auth');

const router = express.Router();

const {
  register,
  login,
  updateRole,
  deleteUser,
  updateUser,
  getByToken,
} = require('../controllers/user');

router.route('/updaterole').put(adminAuth, updateRole);
router.route('/update').put(userAuth, updateUser);
router.route('/deleteUser').delete(adminAuth, deleteUser);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/getbytoken').get(userAuth, getByToken);

module.exports = router;
