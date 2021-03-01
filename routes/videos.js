const { Video, validate } = require('../models/video');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const videos = await Video.find().select('-__v').sort('name');
  res.send(videos);
});

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const video = new Video({
    name: req.body.name,
    category: req.body.category,
    views: req.body.views,

    publishDate: moment().toJSON(),
  });
  await video.save();

  res.send(video);
});

router.put('/:id', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const video = await Video.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category: req.body.category,
      views: req.body.views,
    },
    { new: true }
  );

  if (!video)
    return res.status(404).send('The video with the given ID was not found.');

  res.send(video);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const video = await Video.findByIdAndRemove(req.params.id);

  if (!video)
    return res.status(404).send('The video with the given ID was not found.');

  res.send(video);
});

router.get('/:id', validateObjectId, async (req, res) => {

  const video = await Video.findById(req.params.id).select('-__v');
  
  if (!video)
    return res.status(404).send('The video with the given ID was not found.');

  res.send(video);
});

module.exports = router;
