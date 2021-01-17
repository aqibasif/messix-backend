const { Location, validate } = require('../models/location');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Location.find().select('-__v').sort('label');
  res.send(products);
});

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const location = new Location({
    brandId: req.body.brandId,
    locations: req.body.locations,
  });
  await location.save();

  res.send(location);
});

router.put('/:id', [auth], async (req, res) => {
 
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const product = await Location.findByIdAndUpdate(
    req.params.id,
    {
      brandId: req.body.brandId,
      locations: req.body.locations,
    },
    { new: true }
  );

  if (!product)
    return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send('The Product with the given ID was not found.');

  res.send(product);
});

router.get('/:id', validateObjectId, async (req, res) => {
  let product = await Location.findOne({ brandId: req.params.id });
  // const product = await Product.findById(req.params.id).select('-__v');

  if (!product)
    return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

module.exports = router;
