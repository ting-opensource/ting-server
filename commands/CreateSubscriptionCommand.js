'use strict';

const subscriptionStore = require('../persistance/storage/SubscriptionStore');

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
                return updatedSubscription;
            });
    }
}

module.exports = CreateSubscriptionCommand;
