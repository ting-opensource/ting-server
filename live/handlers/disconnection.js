'use strict';

const logger = require('../../logging/logger');

module.exports = function()
{
    let socket = this;

    logger.info(`Dropped Live Connection: ${socket.id}`);
};
