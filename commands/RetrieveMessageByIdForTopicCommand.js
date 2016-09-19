'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessageByIdForTopicCommand
{
    constructor(messageId, topic)
    {
        this._messageId = messageId;
        this._topic = topic;
    }

    execute()
    {
        let messageId = this._messageId;
        let topic = this._topic;

        return messageStore.retrieveByIdForTopic(messageId, topic);
    }
}

module.exports = RetrieveMessageByIdForTopicCommand;
