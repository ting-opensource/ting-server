'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicTillTimeCommand
{
    constructor(topic, tillTime, pageStart, pageSize)
    {
        this._topic = topic;
        this._tillTime = tillTime;
        this._pageStart = pageStart;
        this._pageSize = pageSize;
    }

    execute()
    {
        let topic = this._topic;
        let tillTime = this._tillTime;
        let pageStart = this._pageStart;
        let pageSize = this._pageSize;

        return messageStore.retrieveForTopicTillTime(topic, tillTime, pageStart, pageSize);
    }
}

module.exports = RetrieveMessagesForTopicTillTimeCommand;
