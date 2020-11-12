const Joi = require('joi');
const mongoose = require('mongoose');
// const { genreSchema } = require('./genre');

const Order = mongoose.model(
  'Orders',

  new mongoose.Schema({
    userId: { type: String, trim: true },
    name: { type: String, trim: true },
    useremail: {
      type: String,
      unique: false,
    },
    profilePic: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    phone: { type: String, trim: true },
    paymentMethod: { type: String, trim: true },
    cartItems: { type: Array, default: [] },
    orderStatus: { type: String, trim: true },

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
    useremail: Joi.string().required(),
    profilePic: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),
    phone: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    orderStatus: Joi.string().required(),
    cartItems: Joi.array().required(),
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
