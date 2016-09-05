'use strict';

const _ = require('lodash');

const subscriptionStore = require('../persistance/storage/SubscriptionStore');
const liveConnectionFacade = require('../live/LiveConnectionFacade').getInstance();

class CreateSubscriptionCommand
{
    constructor(subscription)
    {
        this._subscription = subscription;
    }

    execute()
    {
        let subscription = this._subscription;

        return subscriptionStore.create(subscription)
        .then(function(updatedSubscription)
        {
            liveConnectionFacade.subscribeToUpdatesForTopicByUserId(updatedSubscription.get('subscriber'), updatedSubscription.get('topic'));

            return updatedSubscription;
        });
    }
}

module.exports = CreateSubscriptionCommand;
