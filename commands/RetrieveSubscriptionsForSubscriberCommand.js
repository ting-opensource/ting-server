'use strict';

const subscriptionStore = require('../persistance/storage/SubscriptionStore');

class RetrieveSubscriptionsForSubscriberCommand
{
    constructor(subscriber)
    {
        this._subscriber = subscriber;
    }

    execute()
    {
        let subscriber = this._subscriber;

        return subscriptionStore.retrieveForSubscriber(subscriber);
    }
}

module.exports = RetrieveSubscriptionsForSubscriberCommand;
