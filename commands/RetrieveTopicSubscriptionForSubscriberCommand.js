'use strict';

const subscriptionStore = require('../persistance/storage/SubscriptionStore');

class RetrieveTopicSubscriptionForSubscriberCommand
{
    constructor(topic, subscriber)
    {
        this._topic = topic;
        this._subscriber = subscriber;
    }

    execute()
    {
        let topic = this._topic;
        let subscriber = this._subscriber;

        return subscriptionStore.retrieveForATopicForASubscriber(topic, subscriber);
    }
}

module.exports = RetrieveTopicSubscriptionForSubscriberCommand;
