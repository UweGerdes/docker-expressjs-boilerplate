/**
 * Testing app server
 *
 * @module modules/boilerplate/app/index
 */

'use strict';

const chalk = require('chalk'),
  dateFormat = require('dateformat'),
  express = require('express'),
  morgan = require('morgan'),
  config = require('../../../lib/config');

const app = express();
const port = 3000;

if (config.server.verbose) {
  morgan.token('time', () => {
    return dateFormat(new Date(), 'HH:MM:ss');
  });
  app.use(morgan('[' + chalk.gray(':time') + '] ' +
    'boilerplate app server: :method :status :url :res[content-length] Bytes - :response-time ms'));
}

app.get('/', (req, res) => {
  res.send('Hello other World!\n');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

console.log('loaded: modules/boilerplate/app/index.js');
