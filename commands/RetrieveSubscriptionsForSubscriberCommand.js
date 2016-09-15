'use strict';

const subscriptionStore = require('../persistance/storage/SubscriptionStore');

class RetrieveSubscriptionsForSubscriberCommand
{
    constructor(subscriber, pageStart, pageSize)
    {
        this._subscriber = subscriber;
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute()
    {
        let subscriber = this._subscriber;
        let pageStart = this._pageStart;
        let pageSize = this._pageSize;

        return subscriptionStore.retrieveForSubscriber(subscriber, pageStart, pageSize);
    }
}

module.exports = RetrieveSubscriptionsForSubscriberCommand;
