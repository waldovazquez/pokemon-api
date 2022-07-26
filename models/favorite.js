const Mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const FavoriteSchema = new Mongoose.Schema(
  {
    pokemonId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      default: true,
    },
    pokemon: {
      type: Object,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

FavoriteSchema.plugin(mongoosePaginate);

const Favorite = Mongoose.model('favorite', FavoriteSchema);

Favorite.paginate().then({});

module.exports = Favorite;
