'use strict';

const Boom = require('boom');

const UnsubscribeFromTopicNameCommand = require('../../commands/UnsubscribeFromTopicNameCommand');

module.exports = function(request, reply)
{
    let subscriber = request.auth.credentials.userId;
    let topicName = request.payload.topic.name;

    let command = new UnsubscribeFromTopicNameCommand(subscriber, topicName);
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
