'use strict';

const Boom = require('boom');

const RetrieveMessageByIdCommand = require('./RetrieveMessageByIdCommand');
const RetrieveTopicSubscriptionForSubscriberCommand = require('./RetrieveTopicSubscriptionForSubscriberCommand');
const MarkMessageByIdAsReadCommand = require('./MarkMessageByIdAsReadCommand');
const MarkMessagesForTopicSinceMessageAsReadCommand = require('./MarkMessagesForTopicSinceMessageAsReadCommand');
const MarkMessagesForTopicTillMessageAsReadCommand = require('./MarkMessagesForTopicTillMessageAsReadCommand');

class MarkMessagesAsReadCommand
{
    constructor(subscriber, messageId, sinceMessageId, tillMessageId)
    {
        this._subscriber = subscriber;
        this._messageId = messageId;
        this._sinceMessageId = sinceMessageId;
        this._tillMessageId = tillMessageId;
    }

    execute()
    {
        let subscriber = this._subscriber;
        let messageId = this._messageId;
        let sinceMessageId = this._sinceMessageId;
        let tillMessageId = this._tillMessageId;

        let messageIdToRetrieveBaseMessage = messageId || sinceMessageId || tillMessageId;
        let baseMessage = null;

        let retrieveBaseMessageCommand = new RetrieveMessageByIdCommand(messageIdToRetrieveBaseMessage);
        return retrieveBaseMessageCommand.execute()
        .then((message) =>
        {
            if(message)
            {
                baseMessage = message;
                return message.get('topic');
            }
            else
            {
                throw Boom.notFound(`message with id ${messageId} not found`);
            }
        })
        .then((topic) =>
        {
            let retrieveSubscriptionCommand = new RetrieveTopicSubscriptionForSubscriberCommand(topic, subscriber);
            return retrieveSubscriptionCommand.execute();
        })
        .then((subscription) =>
        {
            if(subscription && subscription.get('isActive'))
            {
                let markMessagesAsReadCommand = null;

                if(messageId)
                {
                    markMessagesAsReadCommand = new MarkMessageByIdAsReadCommand(baseMessage, subscriber);
                    return markMessagesAsReadCommand.execute();
                }
                else if(sinceMessageId)
                {
                    markMessagesAsReadCommand = new MarkMessagesForTopicSinceMessageAsReadCommand(baseMessage, subscriber);
                    return markMessagesAsReadCommand.execute();
                }
                else if(tillMessageId)
                {
                    markMessagesAsReadCommand = new MarkMessagesForTopicTillMessageAsReadCommand(baseMessage, subscriber);
                    return markMessagesAsReadCommand.execute();
                }
                else
                {
                    throw Boom.badRequest(`no messageId, sinceMessageId or tillMessageId is present to mark messages as read for ${baseMessage.get('topic').get('name')} from ${subscriber}`);
                }
            }
            else
            {
                throw Boom.forbidden(`subscriber ${subscriber} is not subscribed to ${baseMessage.get('topic').get('name')}`);
            }
        });
    }
}

module.exports = MarkMessagesAsReadCommand;
