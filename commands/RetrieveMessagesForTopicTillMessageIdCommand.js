'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicTillMessageIdCommand
{
    constructor(topic, tillMessageId)
    {
        this._topic = topic;
        this._tillMessageId = tillMessageId;
    }

    execute()
    {
        let topic = this._topic;
        let tillMessageId = this._tillMessageId;

        return messageStore.retrieveForTopicTillMessageId(topic, tillMessageId);
    }
}

module.exports = RetrieveMessagesForTopicTillMessageIdCommand;
