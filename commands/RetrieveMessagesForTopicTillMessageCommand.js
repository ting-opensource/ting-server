'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicTillMessageCommand
{
    constructor(topic, tillMessage)
    {
        this._topic = topic;
        this._tillMessage = tillMessage;
    }

    execute()
    {
        let topic = this._topic;
        let tillMessage = this._tillMessage;

        return messageStore.retrieveForTopicTillMessage(topic, tillMessage);
    }
}

module.exports = RetrieveMessagesForTopicTillMessageCommand;
