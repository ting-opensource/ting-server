'use strict';

const Promise = require('bluebird');

const knexConfig = require('../knexfile.js');
const knex = require('./knex');

class StorageFacade
{
    migrateToLatest()
    {
        return knex.migrate.latest([knexConfig]);
    }
}

module.exports = new StorageFacade();
