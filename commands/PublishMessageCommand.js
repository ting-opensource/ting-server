'use strict';

const messageStore = require('../persistance/storage/MessageStore');

class PublishMessageCommand
{
    constructor(message)
    {
        this._message = message;
    }

    execute()
    {
        let message = this._message;

        return messageStore.create(message)
            .then(function(updatedMessage)
            {
                return updatedMessage;
            });
    }
}

module.exports = PublishMessageCommand;