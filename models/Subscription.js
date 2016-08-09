'use strict';

const _ = require('lodash');
const Immutable = require('immutable');

const logger = require('../logging/logger');

class Subscription extends Immutable.Record({
    subscriptionId: '',
    topic: null, /*: Topic */
    subscriber: '',
    isDurable: false,
    isActive: false,
    createdAt: null, /*: Moment */
    updatedAt: null, /*: Moment */
})
{
}

module.exports = Subscription;
