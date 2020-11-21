const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const moment = require('moment');
const router = express.Router();
const keys = require('../config/dev');
var app = express();
var cors = require('cors');

app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

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

router.post('/forgotpasswordlink/:email', async (req, res) => {

  if (req.params.email === '') {
    res.status(400).send('email required');
  }

  console.error(req.params.email);

  await User.findOne({
    email: req.params.email,
  }).then(async (user) => {
    if (user === null) {
      console.error('Email not in database');
      res.status(403).send('Email not in db');
    } else {
      const token = crypto.randomBytes(20).toString('hex');
      await user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      });

      console.log(keys.email);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: keys.email,
          pass: keys.password,
        },
      });

      const mailOptions = {
        from: 'aqibasif4422@gamil.com',
        to: `${user.email}`,
        subject: 'Link to reset password (Beverix)',
        text:
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
          `https://beverix.herokuapp.com/reset/${token}\n\n` +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n\n' +
          'Beverix!',
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('there was an error: ', err);
        } else {
          console.log('here is the res: ', response);
          res.status(200).json('recovery email sent');
          // res.header('Access-Control-Allow-Origin', '*');
          // res.header('Access-Control-Allow-Headers', 'Content-Type');
          // next();
        }
      });
    }
  });
});

router.get('/reset/:resetPasswordToken', async (req, res) => {
  // console.log(Op.gt);

  const user = await User.findOne({
    resetPasswordToken: req.params.resetPasswordToken,
    // resetPasswordExpires: {
    //   [Op.gt]: Date.now(),
    // },
  });

  if (user === null) {
    console.error('password reset link is invalid or has expired');
    res.status(403).send('password reset link is invalid or has expired');
  } else {
    const expiry = user.resetPasswordExpires;
    if (expiry < Date.now()) {
      console.error(expiry + '+ ' + Date.now() + '+ ' + expiry < Date.now());
      res.status(404).send('password reset link is invalid or has expired');
    }

    res.status(200).send({
      user: user,
      message: 'password reset link a-ok',
    });
  }
});

module.exports = router;
