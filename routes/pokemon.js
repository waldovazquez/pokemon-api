const express = require('express');

const {
  userAuth,
} = require('../middleware/auth');

const router = express.Router();

const {
  getAllPokemons,
  createPokemon,
  getById,
  getImage,
  getMyPokemons,
  deletePokemon,
} = require('../controllers/pokemon');

router.route('/getallpokemons').get(userAuth, getAllPokemons);
router.route('/create').post(userAuth, createPokemon);
router.route('/getbyid').get(userAuth, getById);
router.route('/getmypokemons').get(userAuth, getMyPokemons);
router.route('/delete').delete(userAuth, deletePokemon);
router.route('/getimage').get(userAuth, getImage);

module.exports = router;
