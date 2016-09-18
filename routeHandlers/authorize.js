'use strict';

const Boom = require('boom');

const AuthenticationCommand = require('../commands/AuthenticationCommand');

module.exports = function(request, reply)
{
    let userId = request.payload.userId;

    if(!userId)
    {
        return reply(Boom.badRequest('userId should be present as post data'));
    }

    let command = new AuthenticationCommand(userId);

    return command.execute()
    .then((response) =>
    {
        return reply(response);
    });
};
