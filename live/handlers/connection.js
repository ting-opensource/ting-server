'use strict';

const logger = require('../../logging/logger');

module.exports = function(socket)
{
    logger.info(`New Live Connection: ${socket.id}`);

    socket.on('disconnect', require('./disconnection'));
};
