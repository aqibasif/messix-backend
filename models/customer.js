const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    phone: { type: String, trim: true },
    name: { type: String },
    publishDate: {
      type: String,
      minlength: 1,
      maxlength: 50000,
    },
  })
);

function validateCustomer(customer) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    phone: Joi.string(),
    name: Joi.string(),
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
