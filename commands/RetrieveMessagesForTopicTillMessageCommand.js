'use strict';

const messageWithReadReceiptStore = require('../persistance/storage/MessageWithReadReceiptStore');

class RetrieveMessagesForTopicTillMessageCommand
{
    constructor(topic, tillMessage, subscriber, pageSize)
    {
        this._topic = topic;
        this._tillMessage = tillMessage;
        this._subscriber = subscriber;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let tillMessage = this._tillMessage;
        let pageSize = this._pageSize;
        let subscriber = this._subscriber;

        return messageWithReadReceiptStore.retrieveForTopicTillMessage(topic, tillMessage, subscriber, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicTillMessageCommand;
