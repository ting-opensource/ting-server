'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicSinceMessageCommand
{
    constructor(topic, sinceMessage)
    {
        this._topic = topic;
        this._sinceMessage = sinceMessage;
    }

    execute()
    {
        let topic = this._topic;
        let sinceMessage = this._sinceMessage;

        return messageStore.retrieveForTopicSinceMessage(topic, sinceMessage);
    }
}

module.exports = RetrieveMessagesForTopicSinceMessageCommand;
