'use strict';

const _ = require('lodash');
const uuid = require('uuid/v4');
const moment = require('moment');
const Immutable = require('immutable');

const knex = require('../knex');
const Subscription = require('../../models/Subscription').default;
const topicStore = require('../../persistance/storage/TopicStore');

class SubscriptionStore
{
    get TABLE_NAME()
    {
        return 'subscriptions';
    }

    _serialize(subscription)
    {
        let serializedData = _.omit(subscription.toJS(), 'topic');

        _.extend(serializedData, {
            topicId: subscription.get('topic').get('topicId'),
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    _deserialize(subscriptionData)
    {
        let serializedData = _.omit(subscriptionData, 'topicId');

        return new Subscription(_.extend(serializedData, {
            isActive: serializedData.isActive ? true : false,
            isDurable: serializedData.isDurable ? true : false,
            createdAt: moment.utc(serializedData.createdAt),
            updatedAt: moment.utc(serializedData.updatedAt)
        }));
    }

    _adaptDataStoreRows(rows)
    {
        let subscriptions = [];

        if(rows.length)
        {
            let topicIds = _.uniq(_.map(rows, (currentRow) =>
            {
                return currentRow.topicId;
            }));

            return topicStore.retrieveByIds(topicIds)
            .then((topics) =>
            {
                subscriptions = _.map(rows, (currentRow) =>
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

                return new Immutable.List(subscriptions);
            });
        }
        else
        {
            return new Immutable.List(subscriptions);
        }
    }

    create(subscription, tx)
    {
        let timestamp = moment.utc();

        subscription = subscription.merge({
            subscriptionId: uuid(),
            createdAt: timestamp,
            updatedAt: timestamp
        });

        let serializedData = this._serialize(subscription);

        let queryBuilder = knex.insert(serializedData).into(this.TABLE_NAME);

        if(tx)
        {
            queryBuilder = queryBuilder.transacting(tx);
        }

        return queryBuilder
        .then(() =>
        {
            return subscription;
        });
    }

    deactivate(subscription, tx)
    {
        let timestamp = moment.utc();

        subscription = subscription.merge({
            isActive: false,
            updatedAt: timestamp
        });

        let serializedData = this._serialize(subscription);

        let queryBuilder = knex.update({
            isActive: serializedData.isActive,
            updatedAt: serializedData.updatedAt
        }).where({
            subscriber: serializedData.subscriber,
            topicId: serializedData.topicId
        }).into(this.TABLE_NAME);

        if(tx)
        {
            queryBuilder = queryBuilder.transacting(tx);
        }

        return queryBuilder
        .then(() =>
        {
            return subscription;
        });
    }

    reactivate(subscription, tx)
    {
        let timestamp = moment.utc();

        subscription = subscription.merge({
            isActive: true,
            updatedAt: timestamp
        });

        let serializedData = this._serialize(subscription);

        let queryBuilder = knex.update({
            isActive: serializedData.isActive,
            updatedAt: serializedData.updatedAt
        }).where({
            subscriber: serializedData.subscriber,
            topicId: serializedData.topicId
        }).into(this.TABLE_NAME);

        if(tx)
        {
            queryBuilder = queryBuilder.transacting(tx);
        }

        return queryBuilder
        .then(() =>
        {
            return subscription;
        });
    }

    retrieveById(subscriptionId)
    {
        return this.retrieveByIds([subscriptionId])
        .then((subscriptions) =>
        {
            return subscriptions.size ? subscriptions.first() : null;
        });
    }

    retrieveByIds(subscriptionIds)
    {
        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('subscriptionId', subscriptionIds)
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveForSubscriber(subscriber, pageStart, pageSize)
    {
        return this.retrieveForSubscribers([subscriber], pageStart, pageSize);
    }

    retrieveForSubscribers(subscribers, pageStart, pageSize)
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
        .whereIn('subscriber', subscribers)
        .offset(pageStart)
        .limit(pageSize)
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }

    retrieveForATopicForASubscriber(topic, subscriber)
    {
        return knex.select('*').from(this.TABLE_NAME)
        .where({
            subscriber: subscriber,
            topicId: topic.get('topicId')
        })
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        })
        .then((subscriptions) =>
        {
            return subscriptions.size ? subscriptions.first() : null;
        });
    }

    retrieveForTopic(topic, pageStart, pageSize)
    {
        return this.retrieveForTopics([topic], pageStart, pageSize);
    }

    retrieveForTopics(topics, pageStart, pageSize)
    {
        if(!pageStart)
        {
            pageStart = 0;
        }

        if(!pageSize)
        {
            pageSize = 99999;
        }

        let topicIds = _.map(topics, (currentTopic) =>
        {
            return currentTopic.get('topicId');
        });

        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('topicId', topicIds)
        .offset(pageStart)
        .limit(pageSize)
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }
}

module.exports = new SubscriptionStore();
