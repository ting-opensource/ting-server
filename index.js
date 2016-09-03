'use strict';

const Hapi = require('hapi');
const config = require('config');

const storageFacade = require('./persistance/StorageFacade');
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
    path: '/',
    handler: function(request, reply)
    {
        return reply('hello world').type('application/json');
    }
});

server.route({
    method: 'GET',
    path: '/heartbeat',
    handler: require('./routeHandlers/heartbeat')
});

/**********/
/* TOPICS */
/**********/

server.route({
    method: 'POST',
    path: '/topics',
    handler: require('./routeHandlers/topics/createTopic')
});

server.route({
    method: 'GET',
    path: '/topics/byname',
    handler: require('./routeHandlers/topics/retrieveTopicByName')
});

server.route({
    method: 'GET',
    path: '/topics/byid',
    handler: require('./routeHandlers/topics/retrieveTopicById')
});

/*****************/
/* SUBSCRIPTIONS */
/*****************/

server.route({
    method: 'POST',
    path: '/subscribe',
    handler: require('./routeHandlers/subscriptions/subscribe')
});

server.route({
    method: 'POST',
    path: '/unsubscribe',
    handler: require('./routeHandlers/subscriptions/unsubscribe')
});

server.route({
    method: 'GET',
    path: '/subscriptions',
    handler: require('./routeHandlers/subscriptions/retriveSubscriptionsOfSubscriber')
});

server.route({
    method: 'POST',
    path: '/messages/publish',
    handler: require('./routeHandlers/messages/publishMessage')
});

server.route({
    method: 'GET',
    path: '/messages',
    handler: require('./routeHandlers/messages/retrieveMessagesForTopic')
});

storageFacade.migrateToLatest()
.then(() =>
{
    return server.register({
        register: require('good'),
        options: HAPI_LOGGING_OPTIONS
    });
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
    throw error;
});
