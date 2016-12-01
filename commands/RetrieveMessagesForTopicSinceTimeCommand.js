'use strict';

const messageWithReadReceiptStore = require('../persistance/storage/MessageWithReadReceiptStore');

class RetrieveMessagesForTopicSinceTimeCommand
{
    constructor(topic, sinceTime, subscriber, pageStart, pageSize)
    {
        this._topic = topic;
        this._sinceTime = sinceTime;
        this._subscriber = subscriber;
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let sinceTime = this._sinceTime;
        let subscriber = this._subscriber;
        let pageStart = this._pageStart;
        let pageSize = this._pageSize;

        return messageWithReadReceiptStore.retrieveForTopicSinceTime(topic, sinceTime, subscriber, pageStart, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicSinceTimeCommand;
