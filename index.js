'use strict';

const Hapi = require('hapi');
const config = require('config');
const Promise = require('bluebird');

const logger = require('./logging/logger');

global.__base = __dirname;

const SERVER_CONFIGURATION = {
    connections: {
        compression: true,
        routes: {
            cors: true
        }
    }
};

const server = new Hapi.Server(SERVER_CONFIGURATION);

server.connection({
    host: config.get('host'),
    port: config.get('port')
});

const HAPI_LOGGING_OPTIONS = {
    reporters: {
        console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
                log: '*',
                response: '*'
            }]
        }, {
            module: 'good-console'
        }, 'stdout']
    }
};

/********/
/* ROOT */
/********/

server.route({
    method: 'GET',
    path:'/',
    handler: function(request, reply)
    {
        return reply('hello world').type('application/json');
    }
});

server.route({
    method: 'GET',
    path:'/heartbeat',
    handler: require('./routeHandlers/heartbeat')
});

return server.register({
    register: require('good'),
    options: HAPI_LOGGING_OPTIONS
})
.then(() =>
{
    return server.register({
        register: require('scooter')
    });
})
.then(() =>
{
    return server.start();
})
.then(() =>
{
    logger.info(`Server running at: ${server.info.uri}`);
})
.catch((error) =>
{
    logger.error(error);
});
