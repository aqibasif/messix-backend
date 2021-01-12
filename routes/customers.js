const { Customer, validate } = require('../models/customer');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const moment = require('moment');

router.get('/', auth, async (req, res) => {
  const customers = await Customer.find().select('-__v').sort();
  res.send(customers);
});

router.post('/', auth, async (req, res) => {
  if (!req.body.name) req.body.name = '-';
  if (!req.body.phone) req.body.phone = '-';

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let oldCustomer = await Customer.findOne({ email: req.body.email });
  // if (oldCustomer) return res.status(400).send('Already registered.');
  //if (oldCustomer) return res.send(oldCustomer);
   if (oldCustomer) return res.send({ oldCustomer, isOld: true });

  let customer = new Customer({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,

    publishDate: moment().toJSON(),
  });
  customer = await customer.save();

  res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', auth, async (req, res) => {
  const customer = await Customer.findById(req.params.id).select('-__v');

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

module.exports = router;
