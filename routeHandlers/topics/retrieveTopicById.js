'use strict';

const Boom = require('boom');

const RetrieveTopicByIdCommand = require('../../commands/RetrieveTopicByIdCommand');

module.exports = function(request, reply)
{
    let topicId = request.query.topicId;

    let command = new RetrieveTopicByIdCommand(topicId);
    return command.execute()
    .then((response) =>
    {
        if(response)
        {
            return reply(response.toJS());
        }
        else
        {
            return reply(Boom.notFound(`topic with id ${topicId} not found`));
        }
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
