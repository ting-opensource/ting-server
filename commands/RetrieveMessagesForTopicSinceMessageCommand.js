'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicSinceMessageCommand
{
    constructor(topic, sinceMessage, pageSize)
    {
        this._topic = topic;
        this._sinceMessage = sinceMessage;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let sinceMessage = this._sinceMessage;
        let pageSize = this._pageSize;

        return messageStore.retrieveForTopicSinceMessage(topic, sinceMessage, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicSinceMessageCommand;
