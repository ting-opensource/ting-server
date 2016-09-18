'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
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
    return server.register({
        register: require('./live')
    });
})
.then(() =>
{
    return server.register({
        register: require('hapi-auth-basic')
    })
    .then(() =>
    {
        let clientValidator = function(request, clientId, clientSecret, callback)
        {
            if(clientId !== config.get('auth').get('clientId'))
            {
                callback(Boom.unauthorized(`clientId did not match`), false);
                return;
            }

            if(clientSecret !== config.get('auth').get('clientSecret'))
            {
                callback(Boom.unauthorized(`clientSecret did not match`), false);
                return;
            }

            let clientCredentials = {
                clientId: clientId,
                clientSecret: clientSecret
            };

            return callback(undefined, true, clientCredentials);
        };

        return server.auth.strategy('simple', 'basic', {
            validateFunc: clientValidator
        });
    });
})
.then(() =>
{
    /********/
    /* AUTH */
    /********/

    server.route({
        method: 'POST',
        path: '/authorize',
        config: {
            auth: 'simple'
        },
        handler: require('./routeHandlers/authorize')
    });
})
.then(() =>
{
    return server.register({
        register: require('hapi-auth-jwt')
    })
    .then(() =>
    {
        let tokenValidator = function(request, decodedToken, callback)
        {
            let credentials = {
                userId: decodedToken.userId
            };

            return callback(undefined, true, credentials);
        };

        return server.auth.strategy('token', 'jwt', {
            key: config.get('auth').get('secret'),
            validateFunc: tokenValidator,
            verifyOptions: {
                algorithms: ['HS256']
            }
        });
    });
})
.then(() =>
{
    /*********************/
    /* SETTING UP ROUTES */
    /*********************/

    /**********/
    /* TOPICS */
    /**********/

    server.route({
        method: 'POST',
        path: '/topics',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/topics/createTopic')
    });

    server.route({
        method: 'GET',
        path: '/topics/byname',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/topics/retrieveTopicByName')
    });

    server.route({
        method: 'GET',
        path: '/topics/byid',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/topics/retrieveTopicById')
    });

    /*****************/
    /* SUBSCRIPTIONS */
    /*****************/

    server.route({
        method: 'POST',
        path: '/subscribe',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/subscriptions/subscribe')
    });

    server.route({
        method: 'POST',
        path: '/unsubscribe',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/subscriptions/unsubscribe')
    });

    server.route({
        method: 'GET',
        path: '/subscriptions',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/subscriptions/retriveSubscriptionsOfSubscriber')
    });

    /************/
    /* MESSAGES */
    /************/

    server.route({
        method: 'POST',
        path: '/messages/publish',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/messages/publishMessage')
    });

    server.route({
        method: 'GET',
        path: '/messages',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/messages/retrieveMessagesForTopic')
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
