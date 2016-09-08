'use strict';

const Boom = require('boom');

const Subscription = require('../models/Subscription');
const Topic = require('../models/Topic');

const RetrieveTopicByNameCommand = require('./RetrieveTopicByNameCommand');
const RetrieveTopicSubscriptionForSubscriberCommand = require('./RetrieveTopicSubscriptionForSubscriberCommand');
const CreateTopicCommand = require('./CreateTopicCommand');
const CreateSubscriptionCommand = require('./CreateSubscriptionCommand');
const ReactivateSubscriptionCommand = require('./ReactivateSubscriptionCommand');

class SubscribeToTopicCommand
{
    constructor(subscriber, topicName, createTopicIfNotExist)
    {
        this._subscriber = subscriber;
        this._topicName = topicName;
        this._createTopicIfNotExist = createTopicIfNotExist;
    }

    execute()
    {
        let subscriber = this._subscriber;
        let topicName = this._topicName;
        let createTopicIfNotExist = this._createTopicIfNotExist;

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
                    isActive: true,
                    createdBy: subscriber,
                    updatedBy: subscriber
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
        });
    }
}

module.exports = SubscribeToTopicCommand;
