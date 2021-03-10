const Joi = require('joi');
const mongoose = require('mongoose');
// const { genreSchema } = require('./genre');

const Chat = mongoose.model(
  'Chats',

  new mongoose.Schema({
    user1: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    
    user2: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    

    messages: { type: Array, default: [] },
  })
);

function validateChat(chat) {
  const schema = {
    user1: Joi.string().min(1).max(50).required(),
    user2: Joi.string().min(1).max(50).required(),
    messages: Joi.array(),
  };

  return Joi.validate(chat, schema);
}

exports.Chat = Chat;
exports.validate = validateChat;
