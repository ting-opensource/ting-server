'use strict';

const _ = require('lodash');
const uuid = require('node-uuid');
const moment = require('moment');

const Subscription = require('../../models/Subscription');
const Topic = require('../../models/Topic');

const logger = require('../../logging/logger');

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
            createdAt: moment.utc(serializedData.createdAt),
            updatedAt: moment.utc(serializedData.updatedAt)
        }));
    }

    create(subscription, tx)
    {
        subscription = subscription.merge({
            subscriptionId: uuid.v4(),
            createdAt: moment.utc(),
            updatedAt: moment.utc()
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

    retrieveById(subscriptionId)
    {
        return this.retrieveByIds([subscriptionId])
        .then((subscriptions) =>
        {
            return subscriptions.length ? subscriptions[0] : null;
        });
    }

    retrieveByIds(subscriptionIds)
    {
        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('subscriptionId', subscriptionIds)
        .then((rows) =>
        {
            let subscriptions = [];

            if(rows.length)
            {
                subscriptions = _.map(rows, (currentRow) => {
                    return this._deserialize(currentRow);
                });
            }

            return subscriptions;
        });
    }

    retrieveForSubscriber(subscriber, pageStart, pageSize)
    {
        return this.retrieveForSubscribers([subscriber], pageStart, pageSize)
        .then((subscriptions) =>
        {
            return subscriptions.length ? subscriptions[0] : null;
        });
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
        .then((rows) =>
        {
            let subscriptions = [];

            if(rows.length)
            {
                subscriptions = _.map(rows, (currentRow) => {
                    return this._deserialize(currentRow);
                });
            }

            return subscriptions;
        });
    }

    retrieveForTopic(topic, pageStart, pageSize)
    {
        return this.retrieveForTopics([topic.get('topicId')], pageStart, pageSize)
        .then((messages) =>
        {
            return messages.length ? messages[0] : null;
        });
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
        };

        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('topicId', topicIds)
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

module.exports = new SubscriptionStore();
