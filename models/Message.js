'use strict';

const Immutable = require('immutable');

const MessageTypes = require('./MessageTypes');

class Message extends Immutable.Record({
    messageId: '',
    topic: null, /* Topic */
    publisher: '',
    type: MessageTypes.TEXT,
    body: '',
    createdAt: null, /* Moment */
    updatedAt: null /* Moment */
})
{
}

module.exports = Message;
