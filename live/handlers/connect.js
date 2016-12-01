'use strict';

const _ = require('lodash');

const logger = require('../../logging/logger');
const hydrateSubscriptions = require('./hydrateSubscriptions');

module.exports = function(socket)
{
    logger.info(`New Live Connection: ${socket.id} from ${socket.request.connection.remoteAddress}`);

    socket.on('disconnect', require('./disconnect'));
    socket.on('subscribe', require('./subscriptions/subscribe'));
    socket.on('unsubscribe', require('./subscriptions/unsubscribe'));
    socket.on('messages/publish', require('./messages/publishMessage'));
    socket.on('message/read', require('./messages/markMessageByIdAsRead'));
    socket.on('messages/since/read', require('./messages/markMessagesSinceMessageIdAsReadForTopic'));
    socket.on('messages/till/read', require('./messages/markMessagesTillMessageIdAsReadForTopic'));

    _.defer(() =>
    {
        hydrateSubscriptions(socket);
    });
};
