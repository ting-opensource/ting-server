'use strict';

const subscriptionStore = require('../persistance/storage/SubscriptionStore');

class RetrieveSubscriptionsForTopicCommand
{
    constructor(topic, pageStart, pageSize)
    {
        this._topic = topic;
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let pageStart = this._pageStart;
        let pageSize = this._pageSize;

        return subscriptionStore.retrieveForTopic(topic, pageStart, pageSize);
    }
}

module.exports = RetrieveSubscriptionsForTopicCommand;
