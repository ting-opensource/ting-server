'use strict';

const Boom = require('boom');

const RetrieveTopicSubscriptionForSubscriberCommand = require('./RetrieveTopicSubscriptionForSubscriberCommand');
const RetrieveMessagesForTopicCommand = require('./RetrieveMessagesForTopicCommand');
const RetrieveMessageByIdForTopicCommand = require('./RetrieveMessageByIdForTopicCommand');
const RetrieveMessagesForTopicTillTimeCommand = require('./RetrieveMessagesForTopicTillTimeCommand');
const RetrieveMessagesForTopicSinceTimeCommand = require('./RetrieveMessagesForTopicSinceTimeCommand');
const RetrieveMessagesForTopicTillMessageCommand = require('./RetrieveMessagesForTopicTillMessageCommand');
const RetrieveMessagesForTopicSinceMessageCommand = require('./RetrieveMessagesForTopicSinceMessageCommand');

class RetrieveMessagesForTopicNameCommand
{
    constructor(subscriber, topicName, tillTime, sinceTime, sinceMessageId, tillMessageId)
    {
        this._subscriber = subscriber;
        this._topicName = topicName;
        this._tillTime = tillTime;
        this._sinceTime = sinceTime;
        this._sinceMessageId = sinceMessageId;
        this._tillMessageId = tillMessageId;
    }

    execute()
    {
        let subscriber = this._subscriber;
        let topicName = this._topicName;
        let tillTime = this._tillTime;
        let sinceTime = this._sinceTime;
        let sinceMessageId = this._sinceMessageId;
        let tillMessageId = this._tillMessageId;

        let retrieveSubscriptionCommand = new RetrieveTopicSubscriptionForSubscriberCommand(topicName, subscriber);

        return retrieveSubscriptionCommand.execute()
        .then((subscription) =>
        {
            if(subscription && subscription.get('isActive'))
            {
                let retrieveMessagesForTopicCommand;

                if(sinceTime)
                {
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicSinceTimeCommand(subscription.get('topic'), sinceTime);
                    return retrieveMessagesForTopicCommand.execute();
                }
                else if(tillTime)
                {
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicTillTimeCommand(subscription.get('topic'), tillTime);
                    return retrieveMessagesForTopicCommand.execute();
                }
                else if(sinceMessageId)
                {
                    let retrieveMessageCommand = new RetrieveMessageByIdForTopicCommand(sinceMessageId, topicName);

                    return retrieveMessageCommand.execute()
                    .then((message) =>
                    {
                        if(message)
                        {
                            retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicSinceMessageCommand(subscription.get('topic'), message);
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
                    let retrieveMessageCommand = new RetrieveMessageByIdForTopicCommand(tillMessageId, topicName);

                    return retrieveMessageCommand.execute()
                    .then((message) =>
                    {
                        if(message)
                        {
                            retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicTillMessageCommand(subscription.get('topic'), message);
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
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicCommand(subscription.get('topic'));
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
