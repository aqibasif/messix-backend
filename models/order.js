const Joi = require('joi');
const mongoose = require('mongoose');
// const { genreSchema } = require('./genre');

const Order = mongoose.model(
  'Orders',

  new mongoose.Schema({
    userId: { type: String, trim: true },
    name: { type: String, trim: true },
    email: { type: String, unique: false },
    phone: { type: String, trim: true },
    brandId: { type: String, trim: true },
    bundleName: { type: String, trim: true },
    bundleId: { type: String, trim: true },
    brandCategory: { type: String, trim: true },
    offerPrice: { type: String, trim: true },
    offerDetail: { type: String, trim: true },
    orderStatus: { type: String, trim: true },
    coupon: { type: String, trim: true, unique: true },
    expiryDate: { type: String },
    branches: { type: Array, default: [] },

    publishDate: {
      type: String,
      minlength: 1,
      maxlength: 50000,
    },
  })
);

function validateOrder(order) {
  const schema = {
    userId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    brandId: Joi.string().required(),
    bundleId: Joi.string().required(),
    bundleName: Joi.string().required(),
    brandCategory: Joi.string().required(),
    offerPrice: Joi.string().required(),
    offerDetail: Joi.string().required(),
    orderStatus: Joi.string().required(),
    coupon: Joi.string().required(),
    branches: Joi.array(),
    expiryDate: Joi.string().required(),
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
