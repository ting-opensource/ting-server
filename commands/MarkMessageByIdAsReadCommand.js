'use strict';

const ReadReceipt = require('../models/ReadReceipt').default;

const readReceiptStore = require('../persistance/storage/ReadReceiptStore');
const liveConnectionFacade = require('../live/LiveConnectionFacade').getInstance();

class MarkMessageByIdAsReadCommand
{
    constructor(message, subscriber)
    {
        this._message = message;
        this._subscriber = subscriber;
    }

    execute()
    {
        let message = this._message;
        let subscriber = this._subscriber;

        return readReceiptStore.retrieveForAMessageForASubscriber(message, subscriber)
        .then((existingReadReceipt) =>
        {
            if(!existingReadReceipt)
            {
                let readReceipt = new ReadReceipt({
                    messageId: message.get('messageId'),
                    subscriber: subscriber
                });

                return readReceiptStore.create(readReceipt)
                .then((updatedReadReceipt) =>
                {
                    liveConnectionFacade.publishReadReceiptForTopic(message.get('topic'), updatedReadReceipt);

                    return updatedReadReceipt;
                });
            }
            else
            {
                return existingReadReceipt;
            }
        });
    }
}

module.exports = MarkMessageByIdAsReadCommand;
