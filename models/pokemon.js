const Mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const PokemonSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    api: {
      type: Boolean,
      default: false,
      required: true,
    },
    hp: {
      type: Number,
      required: true,
    },
    attack: {
      type: Number,
      required: true,
    },
    defense: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    types: [],
    image: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  {
    versionKey: false,
  },
);

PokemonSchema.plugin(mongoosePaginate);

const Pokemon = Mongoose.model('pokemon', PokemonSchema);

Pokemon.paginate().then({});

module.exports = Pokemon;
