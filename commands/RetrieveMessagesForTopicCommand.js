'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicCommand
{
    constructor(topic)
    {
        this._topic = topic;
    }

    execute()
    {
        let topic = this._topic;

        return messageStore.retrieveForTopic(topic);
    }
}

module.exports = RetrieveMessagesForTopicCommand;
