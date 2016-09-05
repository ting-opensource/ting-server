'use strict';

const Boom = require('boom');

const Subscription = require('../models/Subscription');

const RetrieveTopicByNameCommand = require('./RetrieveTopicByNameCommand');
const DeactivateSubscriptionCommand = require('./DeactivateSubscriptionCommand');

class UnsubscribeFromTopicCommand
{
    constructor(subscriber, topicName)
    {
        this._subscriber = subscriber;
        this._topicName = topicName;
    }

    execute()
    {
        let subscriber = this._subscriber;
        let topicName = this._topicName;

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
                throw Boom.notFound(`subscription for topic ${topicName} not found`);
            }
        })
        .then((topic) =>
        {
            let subscription = new Subscription({
                subscriber: subscriber,
                topic: topic,
                isActive: true,
                isDurable: true
            });

            let deactivateSubscriptionCommand = new DeactivateSubscriptionCommand(subscription);

            return deactivateSubscriptionCommand.execute();
        });
    }
}

module.exports = UnsubscribeFromTopicCommand;
