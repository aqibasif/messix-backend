const { Financial, validate } = require('../models/financial');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const financials = await Financial.find().select('-__v').sort('label');
  res.send(financials);
});

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const financial = new Financial({
    brandId: req.body.brandId,
    brandPic: req.body.brandPic,
    brandName: req.body.brandName,
    payment: req.body.payment,
    expiryDate: req.body.expiryDate,
    publishDate: req.body.publishDate,
  });
  await financial.save();

  res.send(financial);
});

router.put('/:id', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const product = await Financial.findByIdAndUpdate(
    req.params.id,
    {
      brandId: req.body.brandId,
      brandName: req.body.brandName,
      payment: req.body.payment,
      expiryDate: req.body.expiryDate,
      publishDate: req.body.publishDate,
  
    },
    { new: true }
  );

  if (!product)
    return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
  
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const product = await Financial.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send('The Product with the given ID was not found.');

  res.send(product);
});

router.get('/:id', validateObjectId, async (req, res) => {
  let product = await Financial.findOne({ brandId: req.params.id });
  // const product = await Product.findById(req.params.id).select('-__v');

  if (!product)
    return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

module.exports = router;
