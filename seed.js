// const { Genre } = require('./models/genre');
const { Product } = require('./models/product');
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
  {
    label: 'Sprite',
    size: '500ML - 6Pcs',
    category: 'Cold drink',
    price: '300',
    imageUrl: '/img/product 11.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Fanta can',
    size: '250ML - 12Pcs',
    category: 'Cold drink',
    price: '850',
    imageUrl: '/img/product 6.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Sprite Zero can',
    size: '250ML - 12Pcs',
    category: 'Cold drink',
    price: '850',
    imageUrl: '/img/product 13.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Sprite Cranberry Can',
    size: '250ML - 12Pcs',
    category: 'Cold drink',
    price: '850',
    imageUrl: '/img/product 12.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Coca-Cola Vanilla Can',
    size: '330ML - 12Pcs',
    category: 'Cold drink',
    price: '1050',
    imageUrl: '/img/product 3.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Coca-Cola Energy Can',
    size: '330ML - 12Pcs',
    category: 'Cold drink',
    price: '1400',
    imageUrl: '/img/product 2.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Glacéau Smartwater',
    size: '1L - 6Pcs',
    category: 'Water',
    price: '600',
    imageUrl: '/img/product 10.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Dasani Mineral Water',
    size: '591ML - 8Pcs',
    category: 'Water',
    price: '320',
    imageUrl: '/img/product 5.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Minute Maid Lemonade',
    size: '250ML - 12Pcs',
    category: 'Juice',
    price: '1500',
    imageUrl: '/img/product 8.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Simply Cranberry Cocktail',
    size: '1L - 8Pcs',
    category: 'Juice',
    price: '1600',
    imageUrl: '/img/product 9.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Innocent Gorgeous Greens',
    size: '250ML - 8Pcs',
    category: 'Juice',
    price: '1200',
    imageUrl: '/img/product 7.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Innocent Bubbles',
    size: '330ML - 12Pcs',
    category: 'Juice',
    price: '1500',
    imageUrl: '/img/product 15.png',
    inStock: 25,
    publishDate: moment().toJSON(),
  },
  {
    label: 'Vitamin Water Energy',
    size: '591ML - 6Pcs',
    category: 'Water',
    price: '720',
    imageUrl: '/img/product 14.png',
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

  await Product.deleteMany({});
  //await Genre.deleteMany({});

  // for (let genre of data) {
  //   const { _id: genreId } = await new Genre({ name: genre.name }).save();
  //   const movies = genre.movies.map((movie) => ({
  //     ...movie,
  //     category: { _id: genreId, name: genre.name },
  //   }));
  //   await Movie.insertMany(movies);
  // }

  await Product.insertMany(data);
  mongoose.disconnect();

  console.info('Done!');
}

seed();
