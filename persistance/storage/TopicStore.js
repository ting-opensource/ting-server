'use strict';

const _ = require('lodash');
const uuid = require('node-uuid');
const moment = require('moment');

const knex = require('../knex');
const Topic = require('../../models/Topic');

const logger = require('../../logging/logger');

class TopicStore
{
    get TABLE_NAME()
    {
        return 'topics';
    }

    _serialize(topic)
    {
        let serializedData = topic.toJS();

        _.extend(serializedData, {
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    _deserialize(topicData)
    {
        let serializedData = topicData;

        return new Topic(_.extend(serializedData, {
            isActive: serializedData.isActive ? true : false,
            createdAt: moment.utc(serializedData.createdAt),
            updatedAt: moment.utc(serializedData.updatedAt)
        }));
    }

    create(topic, tx)
    {
        topic = topic.merge({
            topicId: uuid.v4(),
            createdAt: moment.utc(),
            updatedAt: moment.utc()
        });

        let serializedData = this._serialize(topic);

        let queryBuilder = knex.insert(serializedData).into(this.TABLE_NAME);

        if(tx)
        {
            queryBuilder = queryBuilder.transacting(tx);
        }

        return queryBuilder
        .then(() =>
        {
            return topic;
        });
    }

    retrieveById(topicId)
    {
        return this.retrieveByIds([topicId])
        .then((topics) =>
        {
            return topics.length ? topics[0] : null;
        });
    }

    retrieveByIds(topicIds)
    {
        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('topicId', topicIds)
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            let topics = [];

            if(rows.length)
            {
                topics = _.map(rows, (currentRow) => {
                    return this._deserialize(currentRow);
                });
            }

            return topics;
        });
    }

    retrieveByName(name)
    {
        return this.retrieveByNames([name])
        .then((topics) =>
        {
            return topics.length ? topics[0] : null;
        });
    }

    retrieveByNames(names)
    {
        return knex.select('*').from(this.TABLE_NAME)
        .whereIn('name', names)
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            let topics = [];

            if(rows.length)
            {
                topics = _.map(rows, (currentRow) => {
                    return this._deserialize(currentRow);
                });
            }

            return topics;
        });
    }
}

module.exports = new TopicStore();
