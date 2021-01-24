const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  profilePic: {
    type: String,
    trim: true,
  },
  phone: { type: String, trim: true },
  address: { type: String },
  city: { type: String, trim: true },
  country: { type: String, trim: true },
  postalCode: { type: String, trim: true },

  publishDate: {
    type: String,
    minlength: 1,
    maxlength: 50000,
  },
  isAdmin: Boolean,
  isActive: Boolean,
  isBrand: Boolean,
  paymentExpiry: {type: Date},
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date},
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
      isBrand: this.isBrand,
      isActive: this.isActive,
      phone: this.phone,
      profilePic: this.profilePic,
      address: this.address,
      city: this.city,
    },
    config.get('jwtPrivateKey')
  );
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    phone: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    postalCode: Joi.string(),
    profilePic: Joi.string().min(1),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
