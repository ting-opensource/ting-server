'use strict';

const Boom = require('boom');

const CreateTopicByNameCommand = require('../../commands/CreateTopicByNameCommand');

module.exports = function(request, reply)
{
    let name = request.payload.name;

    let command = new CreateTopicByNameCommand(name);
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
