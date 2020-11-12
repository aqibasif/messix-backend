const express = require('express');
const customers = require('../routes/customers');
const products = require('../routes/products');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const fileupload = require('../routes/fileupload');
const orders = require('../routes/orders');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/customers', customers);
  app.use('/api/products', products);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/orders', orders);
  app.use('/api/fileupload', fileupload);
  app.use(error);
};
