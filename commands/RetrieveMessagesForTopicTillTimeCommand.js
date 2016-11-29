'use strict';

const messageWithReadReceiptStore = require('../persistance/storage/MessageWithReadReceiptStore');

class RetrieveMessagesForTopicTillTimeCommand
{
    constructor(topic, tillTime, subscriber, pageStart, pageSize)
    {
        this._topic = topic;
        this._tillTime = tillTime;
        this._subscriber = subscriber;
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let tillTime = this._tillTime;
        let subscriber = this._subscriber;
        let pageStart = this._pageStart;
        let pageSize = this._pageSize;

        return messageWithReadReceiptStore.retrieveForTopicTillTime(topic, tillTime, subscriber, pageStart, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicTillTimeCommand;
