'use strict';

const Boom = require('boom');

const Subscription = require('../../models/Subscription');
const Topic = require('../../models/Topic');

const RetrieveTopicByNameCommand = require('../../commands/RetrieveTopicByNameCommand');
const RetrieveTopicSubscriptionForSubscriberCommand = require('../../commands/RetrieveTopicSubscriptionForSubscriberCommand');
const CreateTopicCommand = require('../../commands/CreateTopicCommand');
const CreateSubscriptionCommand = require('../../commands/CreateSubscriptionCommand');
const ReactivateSubscriptionCommand = require('../../commands/ReactivateSubscriptionCommand');

module.exports = function(request, reply)
{
    let subscriber = request.query.subscriber;
    let topicName = request.payload.topic.name;
    let createTopicIfNotExist = request.payload.topic.createIfNotExist;

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
        let retrieveSubscriptionCommand = new RetrieveTopicSubscriptionForSubscriberCommand(topic, subscriber);

        return retrieveSubscriptionCommand.execute()
        .then((subscription) =>
        {
            if(!subscription)
            {
                let subscription = new Subscription({
                    subscriber: subscriber,
                    topic: topic,
                    isActive: true,
                    isDurable: true
                });

                let createSubscriptionCommand = new CreateSubscriptionCommand(subscription);

                return createSubscriptionCommand.execute();
            }
            else
            {
                if(!subscription.get('isActive'))
                {
                    let reactivateSubscriptionCommand = new ReactivateSubscriptionCommand(subscription);

                    return reactivateSubscriptionCommand.execute();
                }
                else
                {
                    return subscription;
                }
            }
        });
    })
    .then((response) =>
    {
        return reply(response.toJS());
    });
};
