'use strict';

const Immutable = require('immutable');

let defaultRecord = {
    subscriptionId: '',
    topic: null, /* Topic */
    subscriber: '',
    isDurable: false,
    isActive: false,
    createdAt: null, /* Moment */
    updatedAt: null /* Moment */
};

class Subscription extends Immutable.Record(defaultRecord)
{
}

module.exports.defaultRecord = defaultRecord;
module.exports.default = Subscription;
