'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicSinceMessageIdCommand
{
    constructor(topic, sinceMessageId)
    {
        this._topic = topic;
        this._sinceMessageId = sinceMessageId;
    }

    execute()
    {
        let topic = this._topic;
        let sinceMessageId = this._sinceMessageId;

        return messageStore.retrieveForTopicSinceMessageId(topic, sinceMessageId);
    }
}

module.exports = RetrieveMessagesForTopicSinceMessageIdCommand;
