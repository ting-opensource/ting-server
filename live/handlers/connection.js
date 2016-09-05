'use strict';

const logger = require('../../logging/logger');

module.exports = function(socket)
{
    logger.info(`New Live Connection: ${socket.id}`);

    socket.on('disconnect', require('./disconnection'));
    socket.on('subscribe', require('./subscriptions/subscribe'));
    socket.on('unsubscribe', require('./subscriptions/unsubscribe'));
    socket.on('messages/publish', require('./messages/publishMessage'));
};
