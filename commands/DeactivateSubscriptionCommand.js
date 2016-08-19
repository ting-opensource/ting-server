'use strict';

const subscriptionStore = require('../persistance/storage/SubscriptionStore');

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
                return updatedSubscription;
            });
    }
}

module.exports = DeactivateSubscriptionCommand;
