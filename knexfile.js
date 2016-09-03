'use strict';

const _ = require('lodash');
const config = require('config');

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
        client: 'postgresql',
        connection: {
            database: 'ting',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        }
    }, GENERAL_CONFIGS),

    production: _.extend({
        client: 'postgresql',
        connection: {
            database: 'ting',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        }
    })
};
