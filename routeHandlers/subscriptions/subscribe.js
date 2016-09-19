'use strict';

const Boom = require('boom');

const SubscribeToTopicNameCommand = require('../../commands/SubscribeToTopicNameCommand');

module.exports = function(request, reply)
{
    let subscriber = request.auth.credentials.userId;
    let topicName = request.payload.topic.name;
    let createTopicIfNotExist = request.payload.topic.createIfNotExist;

    let command = new SubscribeToTopicNameCommand(subscriber, topicName, createTopicIfNotExist);
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
