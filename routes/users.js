const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
const moment = require('moment');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.get('/mydetails/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send('The product with the given ID was not found.');
  res.send(user);
});

router.get('/currentpassword/:id/:password', auth, async (req, res) => {
  let user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send('Invalid id.');

  const validPassword = await bcrypt.compare(
    req.params.password,
    user.password
  );
  if (!validPassword) return res.status(400).send('Invalid password.');

  res.send(user);
});

router.get('/forgotpassword/:email/:name', auth, async (req, res) => {
  const user = await User.findOne({
    $and: [{ email: req.params.email }, { name: req.params.name }],
  });

  if (!user)
    return res
      .status(404)
      .send('The user with the given information was not found.');
  res.send(user);
});

router.get('/', auth, async (req, res) => {
  const users = await User.find().select('-__v').sort();
  res.send(users);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  // user = new User(_.pick(req.body, ['name', 'email', 'password']));

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    profilePic: req.body.profilePic,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    postalCode: req.body.postalCode,

    publishDate: moment().toJSON(),
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({
    $and: [{ _id: { $ne: req.params.id } }, { email: req.body.email }],
  });
  if (user) return res.status(400).send('Username already registered.');

  if (req.body.password.length < 40 && !req.body.password.startsWith('$2')) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  user = await User.findByIdAndUpdate(
    req.params.id,
    {
      profilePic: req.body.profilePic,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      postalCode: req.body.postalCode,

    },
    { new: true }
  );

  if (!user)
    return res
      .status(404)
      .send('The user with the given email and id was not found.');

  const token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(user);
});

module.exports = router;
