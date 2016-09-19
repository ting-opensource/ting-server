'use strict';

const Immutable = require('immutable');

class Subscription extends Immutable.Record({
    subscriptionId: '',
    topic: null, /* Topic */
    subscriber: '',
    isDurable: false,
    isActive: false,
    createdAt: null, /* Moment */
    updatedAt: null /* Moment */
})
{
}

module.exports = Subscription;
