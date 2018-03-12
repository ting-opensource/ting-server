'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const config = require('config');

const MessageTypes = require('./models/MessageTypes');
const AuthenticationFacade = require('./authentication/AuthenticationFacade');
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
    config: {
        validate: {
            query: {
                requestId: Joi.string().required()
            }
        }
    },
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
    return AuthenticationFacade.configureAuthetnicationStrategies(server);
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
            auth: 'client',
            validate: {
                payload: Joi.object().keys({
                    userId: Joi.string().max(255).required()
                })
            }
        },
        handler: require('./routeHandlers/authorize')
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
            auth: 'token',
            validate: {
                payload: Joi.object().keys({
                    name: Joi.string().max(1023).required()
                })
            }
        },
        handler: require('./routeHandlers/topics/createTopic')
    });

    server.route({
        method: 'GET',
        path: '/topics/byname',
        config: {
            auth: 'token',
            validate: {
                query: {
                    name: Joi.string().required()
                }
            }
        },
        handler: require('./routeHandlers/topics/retrieveTopicByName')
    });

    server.route({
        method: 'GET',
        path: '/topics/byid',
        config: {
            auth: 'token',
            validate: {
                query: {
                    topicId: Joi.string().required()
                }
            }
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
            auth: 'token',
            validate: {
                payload: Joi.object().keys({
                    topic: Joi.object().keys({
                        name: Joi.string().max(1023).required(),
                        createIfNotExist: Joi.boolean()
                    })
                })
            }
        },
        handler: require('./routeHandlers/subscriptions/subscribe')
    });

    server.route({
        method: 'POST',
        path: '/unsubscribe',
        config: {
            auth: 'token',
            validate: {
                payload: Joi.object().keys({
                    topic: Joi.object().keys({
                        name: Joi.string().max(1023).required()
                    })
                })
            }
        },
        handler: require('./routeHandlers/subscriptions/unsubscribe')
    });

    server.route({
        method: 'POST',
        path: '/unsubscribe/topicforuser',
        config: {
            auth: 'token',
            validate: {
                payload: Joi.object().keys({
                    topic: Joi.object().keys({
                        name: Joi.string().max(1023).required()
                    }),
                    user: Joi.object().keys({
                        userId: Joi.string().max(1023).required()
                    })
                })
            }
        },
        handler: require('./routeHandlers/subscriptions/unsubscribeTopicForUser')
    });

    server.route({
        method: 'GET',
        path: '/subscriptions',
        config: {
            auth: 'token',
            validate: {
                query: {
                    pageStart: Joi.number().min(0),
                    pageSize: Joi.number().positive().min(1).max(9999)
                }
            }
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
            auth: 'token',
            validate: {
                payload: Joi.object().keys({
                    topic: Joi.object().keys({
                        name: Joi.string().max(1023).required(),
                        createIfNotExist: Joi.boolean()
                    }),
                    message: Joi.object().keys({
                        type: [Joi.equal(MessageTypes.TEXT), Joi.equal(MessageTypes.HTML), Joi.equal(MessageTypes.JSON)],
                        body: Joi.string().max(4096).required()
                    })
                })
            }
        },
        handler: require('./routeHandlers/messages/publishMessage')
    });

    server.route({
        method: 'POST',
        path: '/files',
        config: {
            auth: 'token',
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },
            validate: {
                payload: {
                    file: Joi.any().required(),
                    topicName: Joi.string().required(),
                    createTopicIfNotExist: Joi.boolean().required()
                }
            }
        },
        handler: require('./routeHandlers/files/upload')
    });

    server.route({
        method: 'GET',
        path: '/files/{key}',
        config: {
            auth: 'token',
            validate: {
                params: {
                    key: Joi.string().required()
                }
            }
        },
        handler: require('./routeHandlers/files/download')
    });

    server.route({
        method: 'GET',
        path: '/messages',
        config: {
            auth: 'token',
            validate: {
                query: {
                    topic: Joi.string().required(),
                    sinceTime: Joi.date().iso(),
                    tillTime: Joi.date().iso(),
                    sinceMessageId: Joi.string(),
                    tillMessageId: Joi.string(),
                    pageStart: Joi.number().min(0),
                    pageSize: Joi.number().positive().min(1).max(9999)
                }
            }
        },
        handler: require('./routeHandlers/messages/retrieveMessagesForTopic')
    });

    /*****************/
    /* READ RECEIPTS */
    /*****************/

    server.route({
        method: 'PUT',
        path: '/messages/{messageId}/read',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/messages/markMessageByIdAsRead')
    });

    server.route({
        method: 'PUT',
        path: '/messages/since/{sinceMessageId}/read',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/messages/markMessagesSinceMessageIdAsReadForTopic')
    });

    server.route({
        method: 'PUT',
        path: '/messages/till/{tillMessageId}/read',
        config: {
            auth: 'token'
        },
        handler: require('./routeHandlers/messages/markMessagesTillMessageIdAsReadForTopic')
    });

    /******************/
    /* ADMINISTRATION */
    /******************/

    server.route({
        method: 'GET',
        path: '/topic/subscriptions',
        config: {
            auth: 'client',
            validate: {
                query: {
                    topic: Joi.string().required(),
                    pageStart: Joi.number().min(0),
                    pageSize: Joi.number().positive().min(1).max(9999)
                }
            }
        },
        handler: require('./routeHandlers/subscriptions/retrieveSubscriptionsOfTopic')
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

process.on('unhandledRejection', (reason, promise) =>
{
    logger.error('Unhandled Rejection,');
    logger.error(`Promise: ${promise}`);
    logger.error(`Reason: ${reason}`);

    throw reason;
});

process.on('uncaughtException', (error) =>
{
    logger.error('Uncaught Exception,');
    logger.error(error);
});

process.on('warning', (warning) =>
{
    logger.warn('Got following Warning,');
    logger.warn(warning.name);
    logger.warn(warning.message);
    logger.warn(warning.stack);
});

process.on('exit', (code) =>
{
    logger.info(`Application is about to exit with code ${code}`);
});
