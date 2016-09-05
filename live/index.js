'use strict';

const liveConnectionFacade = require('./LiveConnectionFacade').getInstance();

module.exports.register = function(server, options, next)
{
    liveConnectionFacade.initializeWithServer(server.listener);

    next();
};

module.exports.register.attributes = {
    name: 'ting-live'
};
