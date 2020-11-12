const { Product, validate } = require('../models/product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find().select('-__v').sort('label');
  res.send(products);
});

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // const genre = await Genre.findById(req.body.categoryId);
  // if (!genre) {
  //   return res.status(400).send('Invalid Category.');
  // }

  const product = new Product({
    label: req.body.label,
    category: req.body.category,
    price: req.body.price,
    size: req.body.size,
    inStock: req.body.inStock,
    imageUrl: req.body.imageUrl,
    publishDate: moment().toJSON(),
  });
  await product.save();

  res.send(product);
});

router.put('/:id', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // const genre = await Genre.findById(req.body.categoryId);
  // if (!genre) {
  //   return res.status(400).send('Invalid Category.');
  // }

  const product = await Product.findByIdAndUpdate(

    req.params.id,
    {
      label: req.body.label,
      category: req.body.category,
      price: req.body.price,
      size: req.body.size,
      inStock: req.body.inStock,
      imageUrl: req.body.imageUrl,
      publishDate: moment().toJSON(),
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
  const product = await Product.findById(req.params.id).select('-__v');

  if (!product)
    return res.status(404).send('The product with the given ID was not found.');

  res.send(product);
});

module.exports = router;
