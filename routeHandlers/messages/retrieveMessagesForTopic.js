'use strict';

const Boom = require('boom');
const moment = require('moment');

const RetrieveTopicByNameCommand = require('../../commands/RetrieveTopicByNameCommand');
const RetrieveTopicSubscriptionForSubscriberCommand = require('../../commands/RetrieveTopicSubscriptionForSubscriberCommand');
const RetrieveMessagesForTopicCommand = require('../../commands/RetrieveMessagesForTopicCommand');
const RetrieveMessageByIdForTopicCommand = require('../../commands/RetrieveMessageByIdForTopicCommand');
const RetrieveMessagesForTopicTillTimeCommand = require('../../commands/RetrieveMessagesForTopicTillTimeCommand');
const RetrieveMessagesForTopicSinceTimeCommand = require('../../commands/RetrieveMessagesForTopicSinceTimeCommand');
const RetrieveMessagesForTopicTillMessageCommand = require('../../commands/RetrieveMessagesForTopicTillMessageCommand');
const RetrieveMessagesForTopicSinceMessageCommand = require('../../commands/RetrieveMessagesForTopicSinceMessageCommand');

module.exports = function(request, reply)
{
    let subscriber = request.query.subscriber;
    let topicName = request.query.topic;

    let tillTime = request.query.tillTime ? moment.utc(request.query.tillTime, moment.ISO_8601) : null;
    let sinceTime = request.query.sinceTime ? moment.utc(request.query.sinceTime, moment.ISO_8601) : null;
    let sinceMessageId = request.query.sinceMessageId;
    let tillMessageId = request.query.tillMessageId;

    let retrieveTopicCommand = new RetrieveTopicByNameCommand(topicName);

    return retrieveTopicCommand.execute()
    .then((topic) =>
    {
        if(topic)
        {
            return topic;
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
        let retrieveSubscriptionCommand = new RetrieveTopicSubscriptionForSubscriberCommand(topic, subscriber);

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
                    let retrieveMessageCommand = new RetrieveMessageByIdForTopicCommand(sinceMessageId, topic);

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
                            return reply(Boom.notFound(`message with id ${sinceMessageId} is not found in ${topicName}`))
                            .then(() =>
                            {
                                throw new Error('message not present');
                            });
                        }
                    });
                }
                else if(tillMessageId)
                {
                    let retrieveMessageCommand = new RetrieveMessageByIdForTopicCommand(tillMessageId, topic);
                    
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
                            return reply(Boom.notFound(`message with id ${tillMessageId} is not found in ${topicName}`))
                            .then(() =>
                            {
                                throw new Error('message not present');
                            });
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
                return reply(Boom.forbidden(`subscriber ${subscriber} is not subscribed to ${topicName}`))
                .then(() =>
                {
                    throw new Error('subscription not present');
                });
            }
        });
    })
    .then((response) =>
    {
        return reply(response.toJS());
    });
};
