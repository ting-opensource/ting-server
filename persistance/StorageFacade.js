'use strict';

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
