'use strict';

const Boom = require('boom');
const moment = require('moment');

const Authenticator = require('../auth/Authenticator');

module.exports = function(request, reply)
{
    let userId = request.payload.userId;

    if(!userId)
    {
        return reply(Boom.badRequest('userId should be present as post data'));
    }

    let token = Authenticator.generateToken(userId);

    return reply({
        token: token,
        respondedAt: moment.utc()
    });
};
