const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
  const db = config.get('db');
  const opt = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  };

  mongoose.connect(db, opt).then(() => winston.info(`Connected to ${db}...`));
};
