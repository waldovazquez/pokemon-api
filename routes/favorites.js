const express = require('express');

const {
  userAuth,
} = require('../middleware/auth');

const router = express.Router();

const {
  getAllFavorites,
  addToFavorite,
  deleteFavorite,
} = require('../controllers/favorite');

router.route('/getallfavorites').get(userAuth, getAllFavorites);
router.route('/create').post(userAuth, addToFavorite);
router.route('/delete').delete(userAuth, deleteFavorite);

module.exports = router;
