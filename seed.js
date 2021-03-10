
const { User } = require('./models/user');
const mongoose = require('mongoose');
const config = require('config');
const moment = require('moment');

const data = [
  {
    label: 'Coca-Cola',
    size: '500ML - 6Pcs',
    category: 'Cold drink',
    price: '300',
    imageUrl: '/img/product 1.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
];

async function seed() {
  const opt = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };

  await mongoose.connect(config.get('db'), opt);

  await User.deleteMany({});
  await User.insertMany(data);
  mongoose.disconnect();

  console.info('Done!');
}

seed();
