const { Order, validate } = require('../models/order');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment');
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const keys = require('../config/dev');

const stripe = new Stripe(keys.stripeSecret);

router.get('/', async (req, res) => {
  const orders = await Order.find().select('-__v');
  res.send(orders);
});

// router.post('/payments', async (req, res) => {
//   try {
//     const { amount } = req.body;
//     console.log(amount);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'pkr',
//     });

//     res.status(200).send(paymentIntent.client_secret);
//   } catch (error) {
//     res.status(500).json({ statusCode: 500, message: err.message });
//   }
// });

router.post('/', [auth], async (req, res) => {
  const orderBody = req.body;
  let payment = [];
  const amount = orderBody.total * 100;

  if (orderBody.paymentMethod === 'credit card') {
    try {
      payment = await stripe.paymentIntents.create({
        amount,
        currency: 'PKR',
        description: 'Beverix Sale',
        payment_method: orderBody.paymentId,
        confirm: true,
      });

      const p = payment.charges.data[0].payment_method_details.card;

      orderBody.paymentMethod =
        'credit card + ' +
        payment.id +
        ' + ' +
        p.brand +
        ' + ' +
        p.last4 +
        ' + ' +
        p.funding;
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  if (orderBody.paymentMethod) delete orderBody.paymentId;
  if (orderBody.total) delete orderBody.total;

  const { error } = validate(orderBody);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const order = new Order({
    userId: orderBody.userId,
    name: orderBody.name,
    useremail: orderBody.useremail,
    profilePic: orderBody.profilePic,
    address: orderBody.address,
    city: orderBody.city,
    country: orderBody.country,
    postalCode: orderBody.postalCode,
    phone: orderBody.phone,
    paymentMethod: orderBody.paymentMethod,
    cartItems: orderBody.cartItems,
    orderStatus: orderBody.orderStatus,

    publishDate: moment().toJSON(),
  });
  await order.save();

  res.send({ order, payment });
});

router.put('/:id', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      userId: req.body.userId,
      name: req.body.name,
      useremail: req.body.useremail,
      profilePic: req.body.profilePic,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      postalCode: req.body.postalCode,
      phone: req.body.phone,
      paymentMethod: req.body.paymentMethod,
      cartItems: req.body.cartItems,
      orderStatus: req.body.orderStatus,
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

module.exports = router;
