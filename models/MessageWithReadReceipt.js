'use strict';

const Immutable = require('immutable');
const _ = require('lodash');

const defaultRecordForMessage = require('./Message').defaultRecord;

let defaultRecord = _.extend({
    subscriber: '',
    readOn: null
}, defaultRecordForMessage);

class MessageWithReadReceipt extends Immutable.Record(defaultRecord)
{
}

module.exports.defaultRecord = defaultRecord;
module.exports.default = MessageWithReadReceipt;
