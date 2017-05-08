'use strict';

const Boom = require('boom');
const config = require('config');

let authenticationValidator = function(request, username, password, callback)
{
    let clientId = config.get('auth.clientId');
    let clientSecret = config.get('auth.clientSecret');

    if(clientId !== config.get('auth.clientId'))
    {
        callback(Boom.unauthorized(`clientId did not match`), false);
        return;
    }

    if(clientSecret !== config.get('auth.clientSecret'))
    {
        callback(Boom.unauthorized(`clientSecret did not match`), false);
        return;
    }

    if(username === clientId && password === clientSecret)
    {
        let credentials = {
            clientId: clientId,
            isAdmin: true
        };

        return callback(null, true, credentials);
    }
    else
    {
        return callback(null, false);
    }
};

const clientBasicAuthenticationConfiguration = {
    validateFunc: authenticationValidator
};

module.exports = clientBasicAuthenticationConfiguration;
