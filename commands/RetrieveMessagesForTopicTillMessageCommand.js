'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicTillMessageCommand
{
    constructor(topic, tillMessage, pageSize)
    {
        this._topic = topic;
        this._tillMessage = tillMessage;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let tillMessage = this._tillMessage;
        let pageSize = this._pageSize;

        return messageStore.retrieveForTopicTillMessage(topic, tillMessage, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicTillMessageCommand;
