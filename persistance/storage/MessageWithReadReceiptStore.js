'use strict';

const _ = require('lodash');
const moment = require('moment');
const Immutable = require('immutable');

const knex = require('../knex');
const MessageWithReadReceipt = require('../../models/MessageWithReadReceipt').default;
const topicStore = require('../../persistance/storage/TopicStore');
const messageStore = require('../../persistance/storage/MessageStore');
const readReceiptStore = require('../../persistance/storage/ReadReceiptStore');

class MessageWithReadReceiptStore
{
    _deserialize(messageWithReadReceiptData, subscriberForReadReceipt)
    {
        let serializedData = _.omit(messageWithReadReceiptData, 'topicId');

        return new MessageWithReadReceipt(_.extend(serializedData, {
            createdAt: moment.utc(serializedData.createdAt),
            updatedAt: moment.utc(serializedData.updatedAt),
            subscriber: subscriberForReadReceipt,
            readOn: serializedData.readOn ? moment.utc(serializedData.readOn) : null
        }));
    }

    _adaptDataStoreRows(rows, subscriberForReadReceipt)
    {
        let messages = [];

        if(rows.length)
        {
            let topicIds = _.uniq(_.map(rows, (currentRow) =>
            {
                return currentRow.topicId;
            }));

            return topicStore.retrieveByIds(topicIds)
            .then((topics) =>
            {
                messages = _.map(rows, (currentRow) =>
                {
                    let matchedTopic = topics.find((currentTopic) =>
                    {
                        return currentRow.topicId === currentTopic.get('topicId');
                    });

                    if(!matchedTopic)
                    {
                        matchedTopic = null;
                    }

                    return this._deserialize(_.extend({
                        topic: matchedTopic
                    }, currentRow), subscriberForReadReceipt);
                });

                return new Immutable.List(messages);
            });
        }
        else
        {
            return new Immutable.List(messages);
        }
    }

    retrieveById(messageId, subscriberForReadReceipt)
    {
        return this.retrieveByIds([messageId], subscriberForReadReceipt)
        .then((messages) =>
        {
            return messages.size ? messages.first() : null;
        });
    }

    retrieveByIds(messageIds, subscriberForReadReceipt)
    {
        return knex.column([
            `${messageStore.TABLE_NAME}.*`,
            `${readReceiptStore.TABLE_NAME}.updatedAt as readOn`
        ]).select().from(messageStore.TABLE_NAME)
        .leftJoin(readReceiptStore.TABLE_NAME, function()
        {
            this.on(`${messageStore.TABLE_NAME}.messageId`, '=', `${readReceiptStore.TABLE_NAME}.messageId`)
            .andOn(`${readReceiptStore.TABLE_NAME}.subscriber`, '=', knex.raw('?', [subscriberForReadReceipt]));
        })
        .whereIn(`${messageStore.TABLE_NAME}.messageId`, messageIds)
        .orderBy(`${messageStore.TABLE_NAME}.updatedAt`, 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows, subscriberForReadReceipt);
        });
    }

    retrieveByIdForTopic(messageId, topic, subscriberForReadReceipt)
    {
        return this.retrieveByIdsForTopic([messageId], topic, subscriberForReadReceipt)
        .then((messages) =>
        {
            return messages.size ? messages.first() : null;
        });
    }

    retrieveByIdsForTopic(messageIds, topic, subscriberForReadReceipt)
    {
        return knex.column([
            `${messageStore.TABLE_NAME}.*`,
            `${readReceiptStore.TABLE_NAME}.updatedAt as readOn`
        ]).select().from(messageStore.TABLE_NAME)
        .leftJoin(readReceiptStore.TABLE_NAME, function()
        {
            this.on(`${messageStore.TABLE_NAME}.messageId`, '=', `${readReceiptStore.TABLE_NAME}.messageId`)
            .andOn(`${readReceiptStore.TABLE_NAME}.subscriber`, '=', knex.raw('?', [subscriberForReadReceipt]));
        })
        .whereIn(`${messageStore.TABLE_NAME}.messageId`, messageIds)
        .andWhere(`${messageStore.TABLE_NAME}.topicId`, topic.get('topicId'))
        .orderBy(`${messageStore.TABLE_NAME}.updatedAt`, 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows, subscriberForReadReceipt);
        });
    }

    retrieveForTopicTillTime(topic, tillTime, subscriberForReadReceipt, pageStart, pageSize)
    {
        if(!pageStart)
        {
            pageStart = 0;
        }

        if(!pageSize)
        {
            pageSize = 99999;
        }

        return knex.column([
            `${messageStore.TABLE_NAME}.*`,
            `${readReceiptStore.TABLE_NAME}.updatedAt as readOn`
        ]).select().from(messageStore.TABLE_NAME)
        .leftJoin(readReceiptStore.TABLE_NAME, function()
        {
            this.on(`${messageStore.TABLE_NAME}.messageId`, '=', `${readReceiptStore.TABLE_NAME}.messageId`)
            .andOn(`${readReceiptStore.TABLE_NAME}.subscriber`, '=', knex.raw('?', [subscriberForReadReceipt]));
        })
        .where(`${messageStore.TABLE_NAME}.topicId`, topic.get('topicId'))
        .andWhere(`${messageStore.TABLE_NAME}.updatedAt`, '<=', tillTime.toDate())
        .orderBy(`${messageStore.TABLE_NAME}.updatedAt`, 'desc')
        .offset(pageStart)
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows, subscriberForReadReceipt);
        });
    }

    retrieveForTopicSinceTime(topic, sinceTime, subscriberForReadReceipt, pageStart, pageSize)
    {
        if(!pageStart)
        {
            pageStart = 0;
        }

        if(!pageSize)
        {
            pageSize = 99999;
        }

        return knex.column([
            `${messageStore.TABLE_NAME}.*`,
            `${readReceiptStore.TABLE_NAME}.updatedAt as readOn`
        ]).select().from(messageStore.TABLE_NAME)
        .leftJoin(readReceiptStore.TABLE_NAME, function()
        {
            this.on(`${messageStore.TABLE_NAME}.messageId`, '=', `${readReceiptStore.TABLE_NAME}.messageId`)
            .andOn(`${readReceiptStore.TABLE_NAME}.subscriber`, '=', knex.raw('?', [subscriberForReadReceipt]));
        })
        .where(`${messageStore.TABLE_NAME}.topicId`, topic.get('topicId'))
        .andWhere(`${messageStore.TABLE_NAME}.updatedAt`, '>=', sinceTime.toDate())
        .orderBy(`${messageStore.TABLE_NAME}.updatedAt`, 'desc')
        .offset(pageStart)
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows, subscriberForReadReceipt);
        });
    }

    retrieveForTopicTillMessage(topic, tillMessage, subscriberForReadReceipt, pageSize)
    {
        if(!pageSize)
        {
            pageSize = 99999;
        }

        return knex.column([
            `${messageStore.TABLE_NAME}.*`,
            `${readReceiptStore.TABLE_NAME}.updatedAt as readOn`
        ]).select().from(messageStore.TABLE_NAME)
        .leftJoin(readReceiptStore.TABLE_NAME, function()
        {
            this.on(`${messageStore.TABLE_NAME}.messageId`, '=', `${readReceiptStore.TABLE_NAME}.messageId`)
            .andOn(`${readReceiptStore.TABLE_NAME}.subscriber`, '=', knex.raw('?', [subscriberForReadReceipt]));
        })
        .where(`${messageStore.TABLE_NAME}.topicId`, topic.get('topicId'))
        .andWhere(function()
        {
            this.where(`${messageStore.TABLE_NAME}.updatedAt`, '<=', tillMessage.get('updatedAt').toDate())
            .orWhere(`${messageStore.TABLE_NAME}.messageId`, tillMessage.get('messageId'));
        })
        .orderBy(`${messageStore.TABLE_NAME}.updatedAt`, 'desc')
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows, subscriberForReadReceipt);
        });
    }

    retrieveForTopicSinceMessage(topic, sinceMessage, subscriberForReadReceipt, pageSize)
    {
        if(!pageSize)
        {
            pageSize = 99999;
        }

        return knex.column([
            `${messageStore.TABLE_NAME}.*`,
            `${readReceiptStore.TABLE_NAME}.updatedAt as readOn`
        ]).select().from(messageStore.TABLE_NAME)
        .leftJoin(readReceiptStore.TABLE_NAME, function()
        {
            this.on(`${messageStore.TABLE_NAME}.messageId`, '=', `${readReceiptStore.TABLE_NAME}.messageId`)
            .andOn(`${readReceiptStore.TABLE_NAME}.subscriber`, '=', knex.raw('?', [subscriberForReadReceipt]));
        })
        .where(`${messageStore.TABLE_NAME}.topicId`, topic.get('topicId'))
        .andWhere(function()
        {
            this.where(`${messageStore.TABLE_NAME}.updatedAt`, '>=', sinceMessage.get('updatedAt').toDate())
            .orWhere(`${messageStore.TABLE_NAME}.messageId`, sinceMessage.get('messageId'));
        })
        .orderBy(`${messageStore.TABLE_NAME}.updatedAt`, 'desc')
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows, subscriberForReadReceipt);
        });
    }

    retrieveForTopic(topic, subscriberForReadReceipt, pageStart, pageSize)
    {
        if(!pageStart)
        {
            pageStart = 0;
        }

        if(!pageSize)
        {
            pageSize = 99999;
        }

        return knex.column([
            `${messageStore.TABLE_NAME}.*`,
            `${readReceiptStore.TABLE_NAME}.updatedAt as readOn`
        ]).select().from(messageStore.TABLE_NAME)
        .leftJoin(readReceiptStore.TABLE_NAME, function()
        {
            this.on(`${messageStore.TABLE_NAME}.messageId`, '=', `${readReceiptStore.TABLE_NAME}.messageId`)
            .andOn(`${readReceiptStore.TABLE_NAME}.subscriber`, '=', knex.raw('?', [subscriberForReadReceipt]));
        })
        .where(`${messageStore.TABLE_NAME}.topicId`, topic.get('topicId'))
        .orderBy(`${messageStore.TABLE_NAME}.updatedAt`, 'desc')
        .offset(pageStart)
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows, subscriberForReadReceipt);
        });
    }
}

module.exports = new MessageWithReadReceiptStore();
