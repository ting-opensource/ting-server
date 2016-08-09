'use strict';

const _ = require('lodash');
const uuid = require('node-uuid');
const moment = require('moment');

const logger = require('../../logging/logger');

class MessageStore
{
    get TABLE_NAME()
    {
        return 'messages';
    }

    _serialize(message)
    {
        let serializedData = _.omit(message.toJS(), 'topic');

        _.extend(serializedData, {
            topicId: message.get('topic').get('topicId'),
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    _deserialize(messageData)
    {
        let serializedData = _.omit(messageData, 'topicId');

        return new Subscription(_.extend(serializedData, {
            createdAt: moment.utc(serializedData.createdAt),
            updatedAt: moment.utc(serializedData.updatedAt)
        }));
    }

    create(message, tx)
    {
        message = message.merge({
            messageId: uuid.v4(),
            createdAt: moment.utc(),
            updatedAt: moment.utc()
        });

        let serializedData = this._serialize(message);

        let queryBuilder = knex.insert(serializedData).into(this.TABLE_NAME);

        if(tx)
        {
            queryBuilder = queryBuilder.transacting(tx);
        }

        return queryBuilder
        .then(() =>
        {
            return message;
        });
    }

    retrieveById(messageId)
    {
        return this.retrieveByIds([messageId])
        .then((messages) =>
        {
            return messages.length ? messages[0] : null;
        });
    }

    retrieveByIds(messageIds)
    {
        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('messageId', messageIds)
        .then((rows) =>
        {
            let messages = [];

            if(rows.length)
            {
                messages = _.map(rows, (currentRow) => {
                    return this._deserialize(currentRow);
                });
            }

            return messages;
        });
    }

    retrieveFromPublisher(publisher)
    {
        return this.retrieveByTopicNames([publisher])
        .then((messages) =>
        {
            return messages.length ? messages[0] : null;
        });
    }

    retrieveFromPublishers(publishers)
    {
        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('publisher', publishers)
        .then((rows) =>
        {
            let messages = [];

            if(rows.length)
            {
                messages = _.map(rows, (currentRow) => {
                    return this._deserialize(currentRow);
                });
            }

            return messages;
        });
    }

    retrievePage(pageStart, pageSize)
    {
        if(!pageStart)
        {
            pageStart = 0;
        }

        if(!pageSize)
        {
            pageSize = 99999;
        }

        return knex.select('*').from(this.TABLE_NAME)
        .offset(pageStart)
        .limit(pageSize)
        .then((rows) =>
        {
            let messages = [];

            if(rows.length)
            {
                messages = _.map(rows, (currentRow) => {
                    return this._deserialize(currentRow);
                });
            }

            return messages;
        });
    }
}

module.exports = new MessageStore();
