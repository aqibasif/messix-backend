const Joi = require('joi');
const mongoose = require('mongoose');
// const { genreSchema } = require('./genre');

const Video = mongoose.model(
  'Videos',

  new mongoose.Schema({
    name: {
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
    views: {
      type: Number,
      required: true,
      min: 0,
    },
    publishDate: {
      type: String,
      minlength: 1,
      maxlength: 50000,
    },
  })
);

function validateVideo(video) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    category: Joi.string().min(1).max(50).required(),
    views: Joi.number().min(0).required(),    
  };

  return Joi.validate(video, schema);
}

exports.Video = Video;
exports.validate = validateVideo;
