'use strict';

const messageWithReadReceiptStore = require('../persistance/storage/MessageWithReadReceiptStore');

class RetrieveMessagesForTopicCommand
{
    constructor(topic, subscriber, pageStart, pageSize)
    {
        this._topic = topic;
        this._subscriber = subscriber;
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let pageStart = this._pageStart;
        let subscriber = this._subscriber;
        let pageSize = this._pageSize;

        return messageWithReadReceiptStore.retrieveForTopic(topic, subscriber, pageStart, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicCommand;
