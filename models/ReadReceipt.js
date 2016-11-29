'use strict';

const Immutable = require('immutable');

let defaultRecord = {
    messageId: null, /* Message */
    subscriber: '',
    createdAt: null, /* Moment */
    updatedAt: null /* Moment */
};

class ReadReceipt extends Immutable.Record(defaultRecord)
{
}

module.exports.defaultRecord = defaultRecord;
module.exports.default = ReadReceipt;
