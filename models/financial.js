const Joi = require('joi');
const mongoose = require('mongoose');
// const { genreSchema } = require('./genre');

const Financial = mongoose.model(
  'Financials',

  new mongoose.Schema({
    brandId: { type: String, trim: true },
    brandPic: { type: String, trim: true },
    brandName: { type: String, trim: true },
    payment: { type: String },
    expiryDate: { type: String },
    publishDate: {
      type: String,
      minlength: 1,
      maxlength: 50000,
    },
  })
);

function validateFinancial(order) {
  const schema = {
    brandId: Joi.string().required(),
    brandName: Joi.string().required(),
    brandPic: Joi.string().required(),
    payment: Joi.string().required(),
    expiryDate: Joi.string().required(),
    publishDate: Joi.string().required(),
  };

  return Joi.validate(order, schema);
}

exports.Financial = Financial;
exports.validate = validateFinancial;
