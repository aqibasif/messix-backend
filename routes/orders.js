const { Order, validate } = require('../models/order');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment');
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const keys = require('../config/dev');
const nodemailer = require('nodemailer');

const stripe = new Stripe(keys.stripeSecret);

generateCoupon = (length) => {
  var random_string = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSRTUVWXYZ0123456789';

  for (var i = 0; i < length; i++) {
    random_string += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return random_string;
};

getUniqueCoupon = async () => {
  var coupon = generateCoupon(6);
  let isExisting = await Order.findOne({ coupon: coupon });

  if (isExisting) return getUniqueCoupon();
  else return coupon;
};

router.get('/', async (req, res) => {
  const orders = await Order.find().select('-__v');
  res.send(orders);
});

router.post('/', [auth], async (req, res) => {
  const orderBody = req.body;
  orderBody.coupon = await getUniqueCoupon();

  if (orderBody.paymentMethod) delete orderBody.paymentId;
  if (orderBody.total) delete orderBody.total;

  const { error } = validate(orderBody);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const order = new Order({
    userId: orderBody.userId,
    name: orderBody.name,
    email: orderBody.email,
    phone: orderBody.phone,
    brandId: orderBody.brandId,
    bundleId: orderBody.bundleId,
    bundleName: orderBody.bundleName,
    brandCategory: orderBody.brandCategory,
    offerPrice: orderBody.offerPrice,
    offerDetail: orderBody.offerDetail,
    orderStatus: orderBody.orderStatus,
    coupon: orderBody.coupon,
    branches: orderBody.branches,
    expiryDate: orderBody.expiryDate,

    publishDate: moment().toJSON(),
  });
  await order.save();

  res.send(order);
});

router.put('/:id', [auth], async (req, res) => {
  const orderBody = req.body;

  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      userId: orderBody.userId,
      name: orderBody.name,
      email: orderBody.email,
      phone: orderBody.phone,
      brandId: orderBody.brandId,
      bundleId: orderBody.bundleId,
      bundleName: orderBody.bundleName,
      brandCategory: orderBody.brandCategory,
      offerPrice: orderBody.offerPrice,
      offerDetail: orderBody.offerDetail,
      orderStatus: orderBody.orderStatus,
      coupon: orderBody.coupon,
      branches: orderBody.branches,
      expiryDate: orderBody.expiryDate,
    },
    { new: true }
  );

  if (!order)
    return res.status(404).send('The Order with the given ID was not found.');

  res.send(order);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id);

  if (!order)
    return res.status(404).send('The Order with the given ID was not found.');

  res.send(order);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const order = await Order.findById(req.params.id).select('-__v');

  if (!order)
    return res.status(404).send('The Order with the given ID was not found.');

  res.send(order);
});

router.post('/sendcoupon', async (req, res) => {
  const requestedBody = req.body;

  if (requestedBody.email === '') {
    res.status(400).send('email required');
  }

  const user = await Order.findOne({
    email: requestedBody.email,
  });

  if (user === null) {
    console.error('Email not in database');
    res.status(403).send('Email not in db');
  } else {
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
      subject: 'OSHER - Your Coupon',
      html:
        '<div style="padding:  10px;">' +
        '<div style="width: 100%; text-align: center;"><img style="width: 180px;" src="cid:unique@kreata.ee"/></div>' +
        `<h2>Congratulations, ${requestedBody.name}!</h2><br/>` +
        `<p>You are receiving this because you have won this coupon from <b>${requestedBody.bundleName}</b> of <b>${requestedBody.offerPrice} USD.</b></p>` +
        `<p>Your coupon code is:</p><br/> <h1  style="letter-spacing: 1px; font-size: 60px;">${requestedBody.coupon}</h1><br/>` +
        '<h2>OSHER!</h2>' +
        '</div>',
      attachments: [
        {
          filename: 'logo2.png',
          path: 'https://osher.vercel.app/img/logo2.png',
          // path:
          //   '/Users/AqibAsif/React JS Projects/Osher Tplay/osher/public/img/logo2.png',
          // path: path.join(__dirname ,'../../osher/public/img/logo2.png'),
          cid: 'unique@kreata.ee', //same cid value as in the html img src
        },
      ],
      // text:
      //   'Congratulations.\n\n' +
      //   `You are receiving this because you have won this coupon from ${requestedBody.brandName} of ${requestedBody.offerPrice} USD.\n\n` +
      //   `Your coupon code is:\n\n ${requestedBody.coupon}\n\n\n` +
      //   'OSHER!',
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('there was an error: ', err);
        res.status(403).send('Server error');
      } else {
        console.log('here is the res: ', response);
        res.status(200).json('Coupon email sent');
      }
    });
  }
});

module.exports = router;
