'use strict';

const Boom = require('boom');

const Message = require('../../models/Message');
const Topic = require('../../models/Topic');

const RetrieveTopicByNameCommand = require('../../commands/RetrieveTopicByNameCommand');
const CreateTopicCommand = require('../../commands/CreateTopicCommand');
const PublishMessageCommand = require('../../commands/PublishMessageCommand');

module.exports = function(request, reply)
{
    let publisher = request.query.publisher;
    let topicName = request.payload.topic.name;
    let createTopicIfNotExist = request.payload.topic.createIfNotExist;
    let messageType = request.payload.message.type;
    let messageBody = request.payload.message.body;

    let retrieveTopicCommand = new RetrieveTopicByNameCommand(topicName);

    return retrieveTopicCommand.execute()
    .then((topic) =>
    {
        if(topic)
        {
            return topic;
        }
        else if(createTopicIfNotExist)
        {
            let topic = new Topic({
                name: topicName,
                isActive: true
            });

            let createTopicCommand = new CreateTopicCommand(topic);

            return createTopicCommand.execute();
        }
        else
        {
            return reply(Boom.notFound(`topic ${topicName} not found`))
            .then(() =>
            {
                throw new Error('topic not found');
            });
        }
    })
    .then((topic) =>
    {
        let message = new Message({
            topic: topic,
            publisher: publisher,
            type: messageType,
            body: messageBody
        });

        let publishMessageCommand = new PublishMessageCommand(message);

        return publishMessageCommand.execute();
    })
    .then((response) =>
    {
        return reply(response.toJS());
    });
};
