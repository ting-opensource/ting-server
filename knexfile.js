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
            filename: config.get('dataStore').get('sqlite').get('filename')
        },
        debug: true,
        useNullAsDefault: true
    }, GENERAL_CONFIGS),

    staging: _.extend({
        client: 'pg',
        searchPath: 'public',
        connection: {
            host: config.get('dataStore').get('postgres').get('host'),
            port: config.get('dataStore').get('postgres').get('port'),
            database: config.get('dataStore').get('postgres').get('database'),
            user: config.get('dataStore').get('postgres').get('user'),
            password: config.get('dataStore').get('postgres').get('password')
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
            host: config.get('dataStore').get('postgres').get('host'),
            port: config.get('dataStore').get('postgres').get('port'),
            database: config.get('dataStore').get('postgres').get('database'),
            user: config.get('dataStore').get('postgres').get('user'),
            password: config.get('dataStore').get('postgres').get('password')
        },
        pool: {
            min: 2,
            max: 10
        }
    }, GENERAL_CONFIGS)
};
