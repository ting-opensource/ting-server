'use strict';

const logger = require('../../logging/logger');

module.exports = function(socket)
{
    logger.info(`Reconnected: ${socket.id}`);
};
