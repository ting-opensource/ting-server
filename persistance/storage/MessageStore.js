'use strict';

const _ = require('lodash');
const uuid = require('uuid/v4');
const moment = require('moment');
const Immutable = require('immutable');

const knex = require('../knex');
const Message = require('../../models/Message').default;
const topicStore = require('../../persistance/storage/TopicStore');
const readReceiptStore = require('../../persistance/storage/ReadReceiptStore');

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

        return new Message(_.extend(serializedData, {
            createdAt: moment.utc(serializedData.createdAt),
            updatedAt: moment.utc(serializedData.updatedAt)
        }));
    }

    _adaptDataStoreRows(rows)
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
                    }, currentRow));
                });

                return new Immutable.List(messages);
            });
        }
        else
        {
            return new Immutable.List(messages);
        }
    }

    create(message, tx)
    {
        let timestamp = moment.utc();

        message = message.merge({
            messageId: uuid.v4(),
            createdAt: timestamp,
            updatedAt: timestamp
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
            return messages.size ? messages.first() : null;
        });
    }

    retrieveByIds(messageIds)
    {
        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('messageId', messageIds)
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveByIdForTopic(messageId, topic)
    {
        return this.retrieveByIdsForTopic([messageId], topic)
        .then((messages) =>
        {
            return messages.size ? messages.first() : null;
        });
    }

    retrieveByIdsForTopic(messageIds, topic)
    {
        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('messageId', messageIds)
        .andWhere('topicId', topic.get('topicId'))
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveFromPublisher(publisher, pageStart, pageSize)
    {
        return this.retrieveFromPublishers([publisher], pageStart, pageSize);
    }

    retrieveFromPublishers(publishers, pageStart, pageSize)
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
        .whereIn('publisher', publishers)
        .orderBy('updatedAt', 'desc')
        .offset(pageStart)
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveForTopicTillTime(topic, tillTime, pageStart, pageSize)
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
        .where('topicId', topic.get('topicId'))
        .andWhere('updatedAt', '<=', tillTime.toDate())
        .orderBy('updatedAt', 'desc')
        .offset(pageStart)
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveForTopicSinceTime(topic, sinceTime, pageStart, pageSize)
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
        .where('topicId', topic.get('topicId'))
        .andWhere('updatedAt', '>=', sinceTime.toDate())
        .orderBy('updatedAt', 'desc')
        .offset(pageStart)
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveForTopicTillMessage(topic, tillMessage, pageSize)
    {
        if(!pageSize)
        {
            pageSize = 99999;
        }

        return knex.select('*').from(this.TABLE_NAME)
        .where('topicId', topic.get('topicId'))
        .andWhere(function()
        {
            this.where('updatedAt', '<=', tillMessage.get('updatedAt').toDate()).orWhere('messageId', tillMessage.get('messageId'));
        })
        .orderBy('updatedAt', 'desc')
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveForTopicSinceMessage(topic, sinceMessage, pageSize)
    {
        if(!pageSize)
        {
            pageSize = 99999;
        }

        return knex.select('*').from(this.TABLE_NAME)
        .where('topicId', topic.get('topicId'))
        .andWhere(function()
        {
            this.where('updatedAt', '>=', sinceMessage.get('updatedAt').toDate()).orWhere('messageId', sinceMessage.get('messageId'));
        })
        .orderBy('updatedAt', 'desc')
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveForTopic(topic, pageStart, pageSize)
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
        .where('topicId', topic.get('topicId'))
        .orderBy('updatedAt', 'desc')
        .offset(pageStart)
        .limit(pageSize)
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveUnreadMessagesForTopicSinceMessage(topic, sinceMessage, forSubscriber)
    {
        const tableName = this.TABLE_NAME;

        return knex.select('*').from(this.TABLE_NAME)
        .whereNotExists(function()
        {
            this.select('messageId').from(readReceiptStore.TABLE_NAME)
            .whereRaw(`"${tableName}"."messageId" = "${readReceiptStore.TABLE_NAME}"."messageId"`)
            .andWhere(`${readReceiptStore.TABLE_NAME}.subscriber`, '=', forSubscriber);
        })
        .where('topicId', topic.get('topicId'))
        .andWhere(function()
        {
            this.where('updatedAt', '>=', sinceMessage.get('updatedAt').toDate())
            .orWhere('messageId', sinceMessage.get('messageId'));
        })
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveUnreadMessagesForTopicTillMessage(topic, tillMessage, forSubscriber)
    {
        const tableName = this.TABLE_NAME;

        return knex.select('*').from(this.TABLE_NAME)
        .whereNotExists(function()
        {
            this.select('messageId').from(readReceiptStore.TABLE_NAME)
            .whereRaw(`"${tableName}"."messageId" = "${readReceiptStore.TABLE_NAME}"."messageId"`)
            .andWhere(`${readReceiptStore.TABLE_NAME}.subscriber`, '=', forSubscriber);
        })
        .where('topicId', topic.get('topicId'))
        .andWhere(function()
        {
            this.where('updatedAt', '<=', tillMessage.get('updatedAt').toDate())
            .orWhere('messageId', tillMessage.get('messageId'));
        })
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }
}

module.exports = new MessageStore();
