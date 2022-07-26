const express = require('express');

const {
  userAuth,
} = require('../middleware/auth');

const router = express.Router();

const {
  getAllTypes,
} = require('../controllers/type');

router.route('/getalltypes').get(userAuth, getAllTypes);

module.exports = router;
