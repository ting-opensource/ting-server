'use strict';

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile.js');

const knex = require('knex')(knexConfig[environment]);

module.exports = knex;
