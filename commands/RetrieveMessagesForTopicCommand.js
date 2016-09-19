'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicCommand
{
    constructor(topic, pageStart, pageSize)
    {
        this._topic = topic;
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let pageStart = this._pageStart;
        let pageSize = this._pageSize;

        return messageStore.retrieveForTopic(topic, pageStart, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicCommand;
