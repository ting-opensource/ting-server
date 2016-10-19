'use strict';

const Immutable = require('immutable');

class ReadReceipt extends Immutable.Record({
    messageId: null, /* Message */
    subscriber: '',
    createdAt: null, /* Moment */
    updatedAt: null /* Moment */
})
{
}

module.exports = ReadReceipt;
