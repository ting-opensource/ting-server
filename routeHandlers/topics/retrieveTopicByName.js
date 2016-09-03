'use strict';

const Boom = require('boom');

const RetrieveTopicByNameCommand = require('../../commands/RetrieveTopicByNameCommand');

module.exports = function(request, reply)
{
    let topicName = request.query.name;

    let command = new RetrieveTopicByNameCommand(topicName);
    return command.execute()
    .then((response) =>
    {
        if(response)
        {
            return reply(response.toJS());
        }
        else
        {
            return reply(Boom.notFound(`topic with name ${topicName} not found`));
        }
    });
};
