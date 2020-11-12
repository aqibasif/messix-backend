const Joi = require('joi');
const mongoose = require('mongoose');
// const { genreSchema } = require('./genre');

const Product = mongoose.model(
  'Products',

  new mongoose.Schema({
    label: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    size: {
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
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 50000,
    },
    inStock: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500000,
    },
    publishDate: {
      type: String,
      minlength: 1,
      maxlength: 50000,
    }
  })
);

function validateProduct(product) {
  const schema = {
    label: Joi.string().min(1).max(50).required(),
    size: Joi.string().min(1).max(50).required(),
    category: Joi.string().min(1).max(50).required(),
    price: Joi.number().min(0).required(),
    inStock: Joi.number().min(0).required(),
    imageUrl: Joi.string().min(1).required(),
  };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
