'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicSinceTimeCommand
{
    constructor(topic, sinceTime)
    {
        this._topic = topic;
        this._sinceTime = sinceTime;
    }

    execute()
    {
        let topic = this._topic;
        let sinceTime = this._sinceTime;

        return messageStore.retrieveForTopicSinceTime(topic, sinceTime);
    }
}

module.exports = RetrieveMessagesForTopicSinceTimeCommand;
