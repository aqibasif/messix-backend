const Joi = require('joi');
const mongoose = require('mongoose');
// const { genreSchema } = require('./genre');

const Location = mongoose.model(
  'Locations',

  new mongoose.Schema({
    brandId: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    locations: { type: Array, default: [] },
  })
);

function validateLocation(location) {
  const schema = {
  
    brandId: Joi.string().min(1).max(50).required(),
    locations: Joi.array(),
  };

  return Joi.validate(location, schema);
}

exports.Location = Location;
exports.validate = validateLocation;
