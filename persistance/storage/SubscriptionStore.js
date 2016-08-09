'use strict';

const _ = require('lodash');
const moment = require('moment');

const logger = require('../../logging/logger');

class SubscriptionStore
{
    get TABLE_NAME()
    {
        return 'subscriptions';
    }
}

module.exports = new SubscriptionStore();
