'use strict';

const _ = require('lodash');

const subscriptionStore = require('../persistance/storage/SubscriptionStore');
const liveConnectionFacade = require('../live/LiveConnectionFacade').getInstance();

class DeactivateSubscriptionCommand
{
    constructor(subscription)
    {
        this._subscription = subscription;
    }

    execute()
    {
        let subscription = this._subscription;

        return subscriptionStore.deactivate(subscription)
        .then(function(updatedSubscription)
        {
            liveConnectionFacade.unsubscribeFromUpdatesForTopicByUserId(updatedSubscription.get('subscriber'), updatedSubscription.get('topic'));

            return updatedSubscription;
        });
    }
}

module.exports = DeactivateSubscriptionCommand;
