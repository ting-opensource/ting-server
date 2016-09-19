'use strict';

const messageStore = require('../persistance/storage/MessageStore');
const liveConnectionFacade = require('../live/LiveConnectionFacade').getInstance();

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
            liveConnectionFacade.publishMessageForTopic(updatedMessage.get('topic'), updatedMessage);

            return updatedMessage;
        });
    }
}

module.exports = PublishMessageCommand;
