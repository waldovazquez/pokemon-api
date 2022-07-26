const Mongoose = require('mongoose');

const TypeSchema = new Mongoose.Schema(
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
  },
  {
    versionKey: false,
  },
);

const Type = Mongoose.model('type', TypeSchema);

module.exports = Type;
