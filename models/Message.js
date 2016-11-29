'use strict';

const Immutable = require('immutable');

const MessageTypes = require('./MessageTypes');

let defaultRecord = {
    messageId: '',
    topic: null, /* Topic */
    publisher: '',
    type: MessageTypes.TEXT,
    body: '',
    createdAt: null, /* Moment */
    updatedAt: null /* Moment */
};

class Message extends Immutable.Record(defaultRecord)
{
}

module.exports.defaultRecord = defaultRecord;
module.exports.default = Message;
