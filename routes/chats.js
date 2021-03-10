const { Chat, validate } = require('../models/chat');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const chats = await Chat.find().select('-__v').sort('username');
  res.send(chats);
});

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const chat = new Chat({
    user1: req.body.user1,
    user2: req.body.user2,
    messages: req.body.messages,
  });
  await chat.save();

  res.send(chat);
});

router.put('/:id', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const chat = await Chat.findByIdAndUpdate(
    req.params.id,
    {
      user1: req.body.user1,
      user2: req.body.user2,
      messages: req.body.messages,
    },
    { new: true }
  );

  if (!chat)
    return res.status(404).send('The chat with the given ID was not found.');

  res.send(chat);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const chat = await Chat.findByIdAndRemove(req.params.id);

  if (!chat)
    return res.status(404).send('The chat with the given ID was not found.');

  res.send(chat);
});

// router.get('/getchat', async (req, res) => {

//   console.log(req.body);

//   var chat = await Chat.findOne({
//     $and: [{ user1: req.body.id1 }, { user2: req.body.id2 }],
//   });
//   console.log(chat);

//   if (!chat)
//     chat = await Chat.findOne({
//       $and: [{ user1: req.body.id2 }, { user2: req.body.id1 }],
//     });
//   console.log(chat);

//   if (!chat)
//     return res
//       .status(404)
//       .send('The chat with the given information was not found.');

//   res.send(chat);
// });
router.post('/getchat', async (req, res) => {
  var chat = await Chat.findOne({
    $and: [{ user1: req.body.id1 }, { user2: req.body.id2 }],
  });

  if (!chat)
    chat = await Chat.findOne({
      $and: [{ user1: req.body.id2 }, { user2: req.body.id1 }],
    });

  if (!chat)
    return res
      .status(404)
      .send('The chat with the given information was not found.');

  res.send(chat);
});

// router.get('getchat/:id1/:id2', validateObjectId, async (req, res) => {
//   console.log(req.params);
//   var chat = await Chat.findOne({
//     $and: [{ user1: req.params.id1 }, { user2: req.params.id2 }],
//   });
//   console.log(chat);

//   if (!chat)
//     chat = await Chat.findOne({
//       $and: [{ user1: req.params.id2 }, { user2: req.params.id1 }],
//     });
//   console.log(chat);

//   if (!chat)
//     return res
//       .status(404)
//       .send('The chat with the given information was not found.');

//   res.send(chat);
// });

module.exports = router;
