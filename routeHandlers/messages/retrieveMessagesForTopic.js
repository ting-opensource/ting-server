'use strict';

const Boom = require('boom');
const moment = require('moment');

const RetrieveTopicByNameCommand = require('../../commands/RetrieveTopicByNameCommand');
const RetrieveTopicSubscriptionForSubscriberCommand = require('../../commands/RetrieveTopicSubscriptionForSubscriberCommand');
const RetrieveMessagesForTopicCommand = require('../../commands/RetrieveMessagesForTopicCommand');
const RetrieveMessagesForTopicTillTimeCommand = require('../../commands/RetrieveMessagesForTopicTillTimeCommand');
const RetrieveMessagesForTopicSinceTimeCommand = require('../../commands/RetrieveMessagesForTopicSinceTimeCommand');
const RetrieveMessagesForTopicTillMessageIdCommand = require('../../commands/RetrieveMessagesForTopicTillMessageIdCommand');
const RetrieveMessagesForTopicSinceMessageIdCommand = require('../../commands/RetrieveMessagesForTopicSinceMessageIdCommand');

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
                }
                else if(tillTime)
                {
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicTillTimeCommand(subscription.get('topic'), tillTime);
                }
                else if(sinceMessageId)
                {
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicSinceMessageIdCommand(subscription.get('topic'), sinceMessageId);
                }
                else if(tillMessageId)
                {
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicTillMessageIdCommand(subscription.get('topic'), tillMessageId);
                }
                else
                {
                    retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicCommand(subscription.get('topic'));
                }

                return retrieveMessagesForTopicCommand.execute();
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
