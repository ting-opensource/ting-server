'use strict';

const messageWithReadReceiptStore = require('../persistance/storage/MessageWithReadReceiptStore');

class RetrieveMessagesForTopicSinceMessageCommand
{
    constructor(topic, sinceMessage, subscriber, pageSize)
    {
        this._topic = topic;
        this._sinceMessage = sinceMessage;
        this._subscriber = subscriber;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let sinceMessage = this._sinceMessage;
        let subscriber = this._subscriber;
        let pageSize = this._pageSize;

        return messageWithReadReceiptStore.retrieveForTopicSinceMessage(topic, sinceMessage, subscriber, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicSinceMessageCommand;
