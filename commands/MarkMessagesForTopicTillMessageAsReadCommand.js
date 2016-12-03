'use strict';
const _ = require('lodash');

const ReadReceipt = require('../models/ReadReceipt').default;
const readReceiptStore = require('../persistance/storage/ReadReceiptStore');
const messageStore = require('../persistance/storage/MessageStore');
const liveConnectionFacade = require('../live/LiveConnectionFacade').getInstance();

class MarkMessagesForTopicTillMessageAsReadCommand
{
    constructor(tillMessage, subscriber)
    {
        this._tillMessage = tillMessage;
        this._subscriber = subscriber;
    }

    execute()
    {
        let tillMessage = this._tillMessage;
        let subscriber = this._subscriber;

        return messageStore.retrieveUnreadMessagesForTopicTillMessage(tillMessage.get('topic'), tillMessage, subscriber)
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

                return readReceiptStore.createAll(readReceipts.toArray())
                .then((updatedReadReceipts) =>
                {
                    _.forEach(updatedReadReceipts, (datum) =>
                    {
                        liveConnectionFacade.publishReadReceiptForTopic(tillMessage.get('topic'), datum);
                    });

                    return updatedReadReceipts;
                });
            }
            else
            {
                return [];
            }
        });
    }
}

module.exports = MarkMessagesForTopicTillMessageAsReadCommand;
