'use strict';

const _ = require('lodash');
const Immutable = require('immutable');

const logger = require('../logging/logger');

class Topic extends Immutable.Record({
    topicId: '',
    name: '',
    isActive: false,
    createdAt: null, /*: Moment */
    updatedAt: null, /*: Moment */
})
{
}

module.exports = Topic;
