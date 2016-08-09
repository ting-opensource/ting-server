'use strict';

const _ = require('lodash');
const Immutable = require('immutable');

const logger = require('../logging/logger');

class Message extends Immutable.Record({
    messageId: '',
    topic: null, /*: Topic */
    publisher: '',
    body: '',
    isActive: false,
    createdAt: null, /*: Moment */
    updatedAt: null, /*: Moment */
})
{
}

module.exports = Message;
