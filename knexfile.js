'use strict';

const _ = require('lodash');

const GENERAL_CONFIGS = {
    migrations: {
        directory: 'persistance/migrations',
        tableName: 'knex_migrations'
    }
};

module.exports = {

    development: _.extend({
        client: 'sqlite3',
        connection: {
            filename: './dev.sqlite3'
        },
        useNullAsDefault: true
    }, GENERAL_CONFIGS),

    staging: _.extend({
        client: 'pg',
        searchPath: 'public',
        connection: {
            database: 'ting',
            user: 'postgres',
            password: 'postgres'
        },
        pool: {
            min: 2,
            max: 10
        }
    }, GENERAL_CONFIGS),

    production: _.extend({
        client: 'pg',
        searchPath: 'public',
        connection: {
            database: 'ting',
            user: 'postgres',
            password: 'postgres'
        },
        pool: {
            min: 2,
            max: 10
        }
    })
};
