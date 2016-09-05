'use strict';

const Boom = require('boom');

const Message = require('../models/Message');
const Topic = require('../models/Topic');

const RetrieveTopicByNameCommand = require('./RetrieveTopicByNameCommand');
const CreateTopicCommand = require('./CreateTopicCommand');
const PublishMessageCommand = require('./PublishMessageCommand');

class PublishMessageForTopicNameCommand
{
    constructor(publisher, topicName, createTopicIfNotExist, messageBody, messageType)
    {
        this._publisher = publisher;
        this._topicName = topicName;
        this._createTopicIfNotExist = createTopicIfNotExist;
        this._messageBody = messageBody;
        this._messageType = messageType;
    }

    execute()
    {
        let publisher = this._publisher;
        let topicName = this._topicName;
        let createTopicIfNotExist = this._createTopicIfNotExist;
        let messageBody = this._messageBody;
        let messageType = this._messageType;

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
                throw Boom.notFound(`topic ${topicName} not found`);
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
        });
    }
}

module.exports = PublishMessageForTopicNameCommand;
