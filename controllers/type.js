const debug = require('debug')('controllers:type');

const Type = require('../models/type');

exports.getAllTypes = async (_req, res) => {
  debug('getAllTypes called');
  try {
    const types = await Type.find({
      api: true,
    });

    return res.status(200).json({
      data: types,
      ok: true,
    });
  } catch (e) {
    console.info('Error', e);
    res.status(500).json({
      message: 'An error occurred',
      error: e.message,
    });
  }
  return null;
};
