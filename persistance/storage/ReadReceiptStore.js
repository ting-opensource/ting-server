'use strict';

const _ = require('lodash');
const moment = require('moment');
const Immutable = require('immutable');

const knex = require('../knex');
const ReadReceipt = require('../../models/ReadReceipt');

class ReadReceiptStore
{
    get TABLE_NAME()
    {
        return 'read_receipts';
    }

    _serialize(readReceipt)
    {
        let serializedData = _.omit(readReceipt.toJS(), 'message');

        _.extend(serializedData, {
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    _deserialize(readReceiptData)
    {
        let serializedData = _.clone(readReceiptData);

        return new ReadReceipt(_.extend(serializedData, {
            createdAt: moment.utc(serializedData.createdAt),
            updatedAt: moment.utc(serializedData.updatedAt)
        }));
    }

    _adaptDataStoreRows(rows)
    {
        let readReceipts = [];

        if(rows.length)
        {
            readReceipts = _.map(rows, (currentRow) =>
            {
                return this._deserialize(currentRow);
            });

            return new Immutable.List(readReceipts);
        }
        else
        {
            return new Immutable.List(readReceipts);
        }
    }

    create(readReceipt, tx)
    {
        let timestamp = moment.utc();

        readReceipt = readReceipt.merge({
            createdAt: timestamp,
            updatedAt: timestamp
        });

        let serializedData = this._serialize(readReceipt);

        let queryBuilder = knex.insert(serializedData).into(this.TABLE_NAME);

        if(tx)
        {
            queryBuilder = queryBuilder.transacting(tx);
        }

        return queryBuilder
        .then(() =>
        {
            return readReceipt;
        });
    }

    createAll(readReceipts, tx)
    {
        let timestamp = moment.utc();

        readReceipts = _.map(readReceipts, (currentReadReceipt) =>
        {
            return currentReadReceipt.merge({
                createdAt: timestamp,
                updatedAt: timestamp
            });
        });

        let serializedData = _.map(readReceipts, (currentReadReceipt) =>
        {
            return this._serialize(currentReadReceipt);
        });

        let queryBuilder = knex.insert(serializedData).into(this.TABLE_NAME);

        if(tx)
        {
            queryBuilder = queryBuilder.transacting(tx);
        }

        return queryBuilder
        .then(() =>
        {
            return readReceipts;
        });
    }

    retrieveForAMessageForASubscriber(message, subscriber)
    {
        return this.retrieveForMessagesForASubscriber([message], subscriber)
        .then((readReceipts) =>
        {
            return readReceipts.size ? readReceipts.first() : null;
        });
    }

    retrieveForMessagesForASubscriber(messages, subscriber, pageStart, pageSize)
    {
        if(!pageStart)
        {
            pageStart = 0;
        }

        if(!pageSize)
        {
            pageSize = 99999;
        }

        let messageIds = _.map(messages, (currentMessage) =>
        {
            return currentMessage.get('messageId');
        });

        return knex.select('*').from(this.TABLE_NAME)
        .where({
            subscriber: subscriber
        })
        .whereIn('messageId', messageIds)
        .offset(pageStart)
        .limit(pageSize)
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveForMessage(message, pageStart, pageSize)
    {
        return this.retrieveForMessages([message.get('messageId')], pageStart, pageSize)
        .then((readReceipts) =>
        {
            return readReceipts.size ? readReceipts.first() : null;
        });
    }

    retrieveForMessages(messages, pageStart, pageSize)
    {
        if(!pageStart)
        {
            pageStart = 0;
        }

        if(!pageSize)
        {
            pageSize = 99999;
        }

        let messageIds = _.map(messages, (currentMessage) =>
        {
            return currentMessage.get('messageId');
        });

        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('messageId', messageIds)
        .offset(pageStart)
        .limit(pageSize)
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }
}

module.exports = new ReadReceiptStore();
