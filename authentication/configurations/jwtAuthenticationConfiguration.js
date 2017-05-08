'use strict';

const config = require('config');

let tokenValidator = function(request, decodedToken, callback)
{
    let credentials = {
        userId: decodedToken.userId
    };

    return callback(null, true, credentials);
};

const jwtAuthenticationConfiguration = {
    key: config.get('auth.secret'),
    validateFunc: tokenValidator,
    verifyOptions: {
        algorithms: ['HS256']
    }
};

module.exports = jwtAuthenticationConfiguration;
