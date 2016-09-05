'use strict';

const Boom = require('boom');

const PublishMessageForTopicNameCommand = require('../../commands/PublishMessageForTopicNameCommand');

module.exports = function(request, reply)
{
    let publisher = request.query.publisher;
    let topicName = request.payload.topic.name;
    let createTopicIfNotExist = request.payload.topic.createIfNotExist;
    let messageType = request.payload.message.type;
    let messageBody = request.payload.message.body;

    let command = new PublishMessageForTopicNameCommand(publisher, topicName, createTopicIfNotExist, messageBody, messageType);
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
