'use strict';

const _ = require('lodash');

const logger = require('../../logging/logger');
const hydrateSubscriptions = require('./hydrateSubscriptions');

module.exports = function(socket)
{
    logger.info(`New Live Connection: ${socket.id}`);

    socket.on('disconnect', require('./disconnect'));
    socket.on('subscribe', require('./subscriptions/subscribe'));
    socket.on('unsubscribe', require('./subscriptions/unsubscribe'));
    socket.on('messages/publish', require('./messages/publishMessage'));

    _.defer(() =>
    {
        hydrateSubscriptions(socket);
    });
};
