'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicSinceTimeCommand
{
    constructor(topic, sinceTime, pageStart, pageSize)
    {
        this._topic = topic;
        this._sinceTime = sinceTime;
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let sinceTime = this._sinceTime;
        let pageStart = this._pageStart;
        let pageSize = this._pageSize;

        return messageStore.retrieveForTopicSinceTime(topic, sinceTime, pageStart, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicSinceTimeCommand;
