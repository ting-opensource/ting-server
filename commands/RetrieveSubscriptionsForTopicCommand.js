'use strict';

const subscriptionStore = require('../persistance/storage/SubscriptionStore');

class RetrieveSubscriptionsForTopicCommand
{
    constructor(topic)
    {
        this._topic = topic;
    }

    execute()
    {
        let topic = this._topic;

        return subscriptionStore.retrieveForTopic(topic);
    }
}

module.exports = RetrieveSubscriptionsForTopicCommand;
