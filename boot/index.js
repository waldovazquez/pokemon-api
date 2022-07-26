require('dotenv').config();
const bcrypt = require('bcryptjs');
const axios = require('axios');

const User = require('../models/user');
const Pokemon = require('../models/pokemon');
const Type = require('../models/type');

async function getAdmin() {
  try {
    const userData = await User.findOne({
      role: 'admin',
    });

    if (userData) {
      return;
    }

    const responseHash = await bcrypt.hash(`${process.env.PASSWORD}`, 10);

    if (responseHash) {
      await User.create({
        firstName: 'Waldo',
        lastName: 'Vazquez',
        email: 'waldovazquezdev@gmail.com',
        password: responseHash,
        role: 'admin',
        avatar: 'https://static.pokemonpets.com/images/avatars/144-Pikachu.webp',
      });
    }
  } catch (e) {
    console.info('Error', e);
  }
}

async function createTypes() {
  try {
    const typesData = await Type.findOne({
      api: true,
    });

    if (typesData) {
      return;
    }

    const { data } = await axios.get('https://pokeapi.co/api/v2/type');

    const allTypes = data.results.map((type) => ({
      name: type.name,
      api: true,
    }));

    await Promise.all(allTypes.map(async (item) => {
      await Type.create(item);
    }));
  } catch (e) {
    console.info('Error', e);
  }
}

async function getImage(url) {
  try {
    if (url) {
      const image = await axios.get(url);
      if (image.status !== 200) return null;
      return url;
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function getTypes(types) {
  try {
    if (types.length > 0) {
      const newTypes = await Promise.all(types.map(async (tp) => await Type.findOne({
        name: tp.type.name,
      })));

      return newTypes;
    }
    return [];
  } catch (e) {
    console.info('Error: ', e);
  }
  return null;
}

async function createPokemon() {
  try {
    const pokemonData = await Pokemon.findOne({
      api: true,
    });

    if (pokemonData) {
      return;
    }

    const {
      data,
    } = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=1154');

    const result = await Promise.all(data.results.map(async (pk) => {
      const pokemon = await axios.get(pk.url);
      const image = await getImage(pokemon.data.sprites.other['official-artwork'].front_default);
      const newTypes = await getTypes(pokemon.data.types);

      return {
        name: pokemon.data.name,
        hp: pokemon.data.stats[0].base_stat,
        attack: pokemon.data.stats[1].base_stat,
        defense: pokemon.data.stats[2].base_stat,
        speed: pokemon.data.stats[5].base_stat,
        height: pokemon.data.height,
        weight: pokemon.data.weight,
        api: true,
        types: newTypes,
        image,
      };
    }));

    if (result && result.length > 0) {
      await Promise.all(result.map(async (item) => {
        await Pokemon.create(item);
      }));
    }
  } catch (e) {
    console.info('Error', e);
  }
}

async function init() {
  await getAdmin();
  await createTypes();
  await createPokemon();
}

module.exports = init;
