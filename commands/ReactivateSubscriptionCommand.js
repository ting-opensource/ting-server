'use strict';

const subscriptionStore = require('../persistance/storage/SubscriptionStore');

class ReactivateSubscriptionCommand
{
    constructor(subscription)
    {
        this._subscription = subscription;
    }

    execute()
    {
        let subscription = this._subscription;

        return subscriptionStore.reactivate(subscription)
            .then(function(updatedSubscription)
            {
                return updatedSubscription;
            });
    }
}

module.exports = ReactivateSubscriptionCommand;
