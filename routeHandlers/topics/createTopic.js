'use strict';

const Boom = require('boom');

const CreateTopicByNameCommand = require('../../commands/CreateTopicByNameCommand');

module.exports = function(request, reply)
{
    let name = request.payload.name;
    let requestedBy = request.auth.credentials.userId;

    let command = new CreateTopicByNameCommand(name, requestedBy);
    return command.execute()
    .then((response) =>
    {
        return reply(response.toJS());
    })
    .catch((error) =>
    {
        if(error.isBoom)
        {
            return reply(error);
        }
        else
        {
            return reply(Boom.wrap(error, 500));
        }
    });
};
