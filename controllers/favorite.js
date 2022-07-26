const debug = require('debug')('controllers:favorite');

const jwt = require('jsonwebtoken');

const Favorite = require('../models/favorite');
const Pokemon = require('../models/pokemon');

exports.addToFavorite = async (req, res) => {
  debug('addToFavorite called');
  try {
    const {
      pokemonId,
    } = req.body;

    const token = req.get('authorization').substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken) {
      const favorites = await Favorite.find({
        userId: decodedToken.id,
      });

      if (favorites.filter((fav) => fav.pokemonId === pokemonId).length) {
        return res.status(200).json({
          message: 'You already have this pokemon in your favorites list',
          ok: false,
        });
      }

      const pokemon = await Pokemon.findById(pokemonId);

      const response = await Favorite.create({
        pokemonId,
        userId: decodedToken.id,
        pokemon,
      });

      if (response) {
        return res.status(200).json({
          message: 'Favorite Successfully Created',
          ok: true,
        });
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

exports.deleteFavorite = async (req, res) => {
  debug('deleteFavorite called');
  try {
    const {
      id,
    } = req.body;

    const favorite = await Favorite.findById(id);

    const responseRemove = await favorite.remove();

    if (responseRemove) {
      return res.status(200).json({
        message: 'Favorite Successfully Deleted',
        ok: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
    });
  }
  return null;
};

exports.getAllFavorites = async (req, res) => {
  debug('getAllFavorites called');
  try {
    const {
      page,
    } = req.query;

    const token = req.get('authorization').substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken) {
      if (page) {
        const result = await Favorite.paginate({
          userId: decodedToken.id,
        }, {
          limit: 18,
          page,
        });

        if (result) {
          return res.status(200).json(result);
        }
        return res.status(400).json({
          message: 'An error occurred',
        });
      }
      const favorites = await Favorite.find({ userId: decodedToken.id });
      return res.status(200).json({
        favorites,
        ok: true,
      });
    }
  } catch (e) {
    console.info('Error: ', e);
    res.status(500).json({
      message: 'An error occurred',
    });
  }
  return null;
};
