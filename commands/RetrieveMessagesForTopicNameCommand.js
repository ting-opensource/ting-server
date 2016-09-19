'use strict';

const Boom = require('boom');

const RetrieveTopicByNameCommand = require('./RetrieveTopicByNameCommand');
const RetrieveTopicSubscriptionForSubscriberCommand = require('./RetrieveTopicSubscriptionForSubscriberCommand');
const RetrieveMessagesForTopicCommand = require('./RetrieveMessagesForTopicCommand');
const RetrieveMessageByIdForTopicCommand = require('./RetrieveMessageByIdForTopicCommand');
const RetrieveMessagesForTopicTillTimeCommand = require('./RetrieveMessagesForTopicTillTimeCommand');
const RetrieveMessagesForTopicSinceTimeCommand = require('./RetrieveMessagesForTopicSinceTimeCommand');
const RetrieveMessagesForTopicTillMessageCommand = require('./RetrieveMessagesForTopicTillMessageCommand');
const RetrieveMessagesForTopicSinceMessageCommand = require('./RetrieveMessagesForTopicSinceMessageCommand');

class RetrieveMessagesForTopicNameCommand
{
    constructor(subscriber, topicName, tillTime, sinceTime, sinceMessageId, tillMessageId, pageStart, pageSize)
    {
        this._subscriber = subscriber;
        this._topicName = topicName;
        this._tillTime = tillTime;
        this._sinceTime = sinceTime;
        this._sinceMessageId = sinceMessageId;
        this._tillMessageId = tillMessageId;
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute()
    {
        let subscriber = this._subscriber;
        let topicName = this._topicName;
        let tillTime = this._tillTime;
        let sinceTime = this._sinceTime;
        let sinceMessageId = this._sinceMessageId;
        let tillMessageId = this._tillMessageId;
        let pageStart = this._pageStart;
        let pageSize = this._pageSize;

        let retrieveTopicCommand = new RetrieveTopicByNameCommand(topicName);

        return retrieveTopicCommand.execute()
        .then((topic) =>
        {
            if(topic)
            {
                let retrieveSubscriptionCommand = new RetrieveTopicSubscriptionForSubscriberCommand(topic, subscriber);
                return retrieveSubscriptionCommand.execute();
            }
            else
            {
                throw Boom.notFound(`topic ${topicName} not found`);
            }
        })
        .then((subscription) =>
        {
            if(subscription && subscription.get('isActive'))
            {
                let retrieveMessagesForTopicCommand;

                if(sinceTime)
                {
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicSinceTimeCommand(subscription.get('topic'), sinceTime, pageStart, pageSize);
                    return retrieveMessagesForTopicCommand.execute();
                }
                else if(tillTime)
                {
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicTillTimeCommand(subscription.get('topic'), tillTime, pageStart, pageSize);
                    return retrieveMessagesForTopicCommand.execute();
                }
                else if(sinceMessageId)
                {
                    let retrieveMessageCommand = new RetrieveMessageByIdForTopicCommand(sinceMessageId, subscription.get('topic'));

                    return retrieveMessageCommand.execute()
                    .then((message) =>
                    {
                        if(message)
                        {
                            retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicSinceMessageCommand(subscription.get('topic'), message, pageStart, pageSize);
                            return retrieveMessagesForTopicCommand.execute();
                        }
                        else
                        {
                            throw Boom.notFound(`message with id ${sinceMessageId} is not found in ${topicName}`);
                        }
                    });
                }
                else if(tillMessageId)
                {
                    let retrieveMessageCommand = new RetrieveMessageByIdForTopicCommand(tillMessageId, subscription.get('topic'));

                    return retrieveMessageCommand.execute()
                    .then((message) =>
                    {
                        if(message)
                        {
                            retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicTillMessageCommand(subscription.get('topic'), message, pageStart, pageSize);
                            return retrieveMessagesForTopicCommand.execute();
                        }
                        else
                        {
                            throw Boom.notFound(`message with id ${tillMessageId} is not found in ${topicName}`);
                        }
                    });
                }
                else
                {
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicCommand(subscription.get('topic'), pageStart, pageSize);
                    return retrieveMessagesForTopicCommand.execute();
                }
            }
            else
            {
                throw Boom.forbidden(`subscriber ${subscriber} is not subscribed to ${topicName}`);
            }
        });
    }
}

module.exports = RetrieveMessagesForTopicNameCommand;
