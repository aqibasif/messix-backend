const Joi = require('joi');
const mongoose = require('mongoose');
// const { genreSchema } = require('./genre');

const Product = mongoose.model(
  'Products',

  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    brandId: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    details: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2500,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2500,
    },
    inStock: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
    expiryDate: {
      type: String,
      minlength: 1,
      maxlength: 50000,
    },
video: {
      type: String,
    },
    branches: { type: Array, default: [] },
    img: { type: Array, default: [] },
    offers: { type: Array, default: [] },

    publishDate: {
      type: String,
      minlength: 1,
      maxlength: 50000,
    },
  })
);

function validateProduct(product) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    brandId: Joi.string().min(1).max(50).required(),
    category: Joi.string().min(1).max(50).required(),
    inStock: Joi.number().min(0).required(),
    details: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    expiryDate: Joi.string().required(),
    video: Joi.string(),
    img: Joi.array().required(),
    offers: Joi.array(),
    branches: Joi.array(),
  };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
