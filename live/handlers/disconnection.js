'use strict';

const liveConnectionFacade = require('../LiveConnectionFacade').getInstance();
const logger = require('../../logging/logger');

module.exports = function()
{
    let socket = this;

    let userId = socket.auth.credentials.userId;
    liveConnectionFacade.deleteSocketForUserId(userId);

    logger.info(`Dropped Live Connection for User Id ${userId} with Socket Id ${socket.id}`);
};
