const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'Basic',
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const User = Mongoose.model('user', UserSchema);

module.exports = User;
