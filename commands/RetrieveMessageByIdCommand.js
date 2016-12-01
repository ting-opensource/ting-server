'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class RetrieveMessageByIdCommand
{
    constructor(messageId, topic)
    {
        this._messageId = messageId;
    }

    execute()
    {
        let messageId = this._messageId;

        return messageStore.retrieveById(messageId);
    }
}

module.exports = RetrieveMessageByIdCommand;
