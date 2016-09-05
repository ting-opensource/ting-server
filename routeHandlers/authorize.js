'use strict';

const Boom = require('boom');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('config');

module.exports = function(request, reply)
{
    let userId = request.payload.userId;

    if(!userId)
    {
        return reply(Boom.badRequest('userId should be present as post data'));
    }

    let token = jwt.sign({
        userId: userId
    }, config.get('auth').get('secret'), {
        expiresIn: '7d',
        issuer: 'ting-server',
        audience: 'ting-client'
    });

    return reply({
        token: token,
        respondedAt: moment.utc()
    });
};
