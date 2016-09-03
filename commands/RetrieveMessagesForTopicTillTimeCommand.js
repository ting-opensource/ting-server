'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessagesForTopicTillTimeCommand
{
    constructor(topic, tillTime)
    {
        this._topic = topic;
        this._tillTime = tillTime;
    }

    execute()
    {
        let topic = this._topic;
        let tillTime = this._tillTime;

        return messageStore.retrieveForTopicTillTime(topic, tillTime);
    }
}

module.exports = RetrieveMessagesForTopicTillTimeCommand;
