const debug = require('debug')('controllers:pokemon');
const jwt = require('jsonwebtoken');

const Pokemon = require('../models/pokemon');

const {
  getQuery,
} = require('../utils/query');

exports.getAllPokemons = async (req, res) => {
  debug('getAllPokemons called');
  try {
    const {
      page,
      sort,
      query,
    } = req.query;

    const token = req.get('authorization').substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken) {
      if (query || sort) {
        const q = getQuery(query || null, decodedToken.id, sort ? JSON.parse(sort) : null);

        const options = {
          limit: 18,
          page,
        };
        if (q.sort.by && q.sort.value !== '') {
          options.sort = {
            [q.sort.by]: q.sort.value,
          };
        }
        const result = await Pokemon.paginate(q.query, options);

        if (result) {
          return res.status(200).json(result);
        }
      }
      const resultWithoutQuery = await Pokemon.paginate({
        $or: [
          {
            userId: { $exists: false },
          },
          {
            userId: decodedToken.id,
          },
        ],
      }, {
        limit: 18,
        page,
      });

      if (resultWithoutQuery) {
        return res.status(200).json(resultWithoutQuery);
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

exports.getById = async (req, res) => {
  debug('getById called');
  try {
    const {
      id,
    } = req.query;

    if (id) {
      const pokemon = await Pokemon.findById(id);
      if (pokemon) {
        return res.status(200).json({
          data: pokemon,
          ok: true,
        });
      }
    } else {
      return res.status(400).json({
        message: 'Not Found, id not available',
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

exports.getMyPokemons = async (req, res) => {
  debug('getMyPokemons called');
  try {
    const {
      page,
    } = req.query;

    const token = req.get('authorization').substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken) {
      const result = await Pokemon.paginate({
        userId: decodedToken.id,
      }, {
        limit: 18,
        page,
      });

      if (result) {
        res.status(200).json(result);
      }
    } else {
      return res.status(400).json({
        message: 'An error occurred',
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

exports.deletePokemon = async (req, res) => {
  debug('deletePokemon called');
  try {
    const {
      id,
    } = req.body;

    const pokemon = await Pokemon.findById(id);

    const token = req.get('authorization').substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (pokemon.userId !== decodedToken.id) {
      return res.status(200).json({
        message: 'You are not allowed to do this operation',
      });
    }

    const responseRemove = await pokemon.remove();

    if (responseRemove) {
      return res.status(200).json({
        message: 'Pokemon Successfully Deleted',
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

exports.createPokemon = async (req, res) => {
  debug('createPokemon called');
  try {
    const {
      name,
      hp,
      attack,
      defense,
      speed,
      height,
      weight,
      types,
      image,
    } = req.body;

    const token = req.get('authorization').substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken) {
      const response = await Pokemon.create({
        name,
        hp,
        attack,
        defense,
        speed,
        height,
        weight,
        types,
        image,
        userId: decodedToken.id,
      });

      if (response) {
        return res.status(200).json({
          message: 'Pokemon Successfully Created',
          ok: true,
        });
      }
    } else {
      return res.status(400).json({
        message: 'An error occurred',
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

exports.getImage = async (_req, res) => {
  debug('getImage called');
  try {
    const pokemons = await Pokemon.aggregate([{
      $sample: { size: 5 },
    },
    {
      $match: {
        image: { $ne: null },
      },
    },
    ]);

    const imageRandom = pokemons[0].image;

    if (imageRandom) {
      return res.status(200).json({
        image: imageRandom,
        ok: true,
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
