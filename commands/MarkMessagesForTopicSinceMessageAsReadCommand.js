'use strict';

const ReadReceipt = require('../models/ReadReceipt').default;

const readReceiptStore = require('../persistance/storage/ReadReceiptStore');
const messageStore = require('../persistance/storage/MessageStore');

class MarkMessagesForTopicSinceMessageIdAsReadCommand
{
    constructor(sinceMessage, subscriber)
    {
        this._sinceMessage = sinceMessage;
        this._subscriber = subscriber;
    }

    execute()
    {
        let sinceMessage = this._sinceMessage;
        let subscriber = this._subscriber;

        return messageStore.retrieveUnreadMessagesForTopicSinceMessage(sinceMessage.get('topic'), sinceMessage, subscriber)
        .then((messages) =>
        {
            if(messages.size)
            {
                let readReceipts = messages.toSeq().map((currentMessage) =>
                {
                    let readReceipt = new ReadReceipt({
                        messageId: currentMessage.get('messageId'),
                        subscriber: subscriber
                    });

                    return readReceipt;
                }).toList();

                return readReceiptStore.createAll(readReceipts.toArray());
            }
            else
            {
                return [];
            }
        });
    }
}

module.exports = MarkMessagesForTopicSinceMessageIdAsReadCommand;
