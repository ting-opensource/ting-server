'use strict';

const ConnectionManager = require('./ConnectionManager');

module.exports.register = function(server, options, next)
{
    let connectionManager = ConnectionManager.getInstance();

    connectionManager.initializeWithServer(server.listener);

    next();
};

module.exports.register.attributes = {
    name: 'ting-live'
};
