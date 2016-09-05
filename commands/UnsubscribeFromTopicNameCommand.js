'use strict';

const Boom = require('boom');

const RetrieveTopicByNameCommand = require('./RetrieveTopicByNameCommand');
const RetrieveTopicSubscriptionForSubscriberCommand = require('./RetrieveTopicSubscriptionForSubscriberCommand');
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
                throw Boom.notFound(`topic ${topicName} not found`);
            }
        })
        .then((topic) =>
        {
            let retrieveSubscriptionCommand = new RetrieveTopicSubscriptionForSubscriberCommand(topic, subscriber);

            return retrieveSubscriptionCommand.execute()
            .then((subscription) =>
            {
                if(subscription)
                {
                    let deactivateSubscriptionCommand = new DeactivateSubscriptionCommand(subscription);

                    return deactivateSubscriptionCommand.execute();
                }
                else
                {
                    throw Boom.notFound(`subscription for topic ${topicName} not found`);
                }
            });
        });
    }
}

module.exports = UnsubscribeFromTopicCommand;
