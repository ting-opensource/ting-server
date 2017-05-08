'use strict';

const knexConfig = require('../knexfile');
const knex = require('./knex');

class StorageFacade
{
    migrateToLatest()
    {
        return knex.migrate.latest([knexConfig]);
    }
}

module.exports = new StorageFacade();
