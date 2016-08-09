'use strict';

const topicStore = require('../persistance/storage/TopicStore');
const subscriptionStore = require('../persistance/storage/SubscriptionStore');
const messageStore = require('../persistance/storage/MessageStore');

function createTopicsTable(knex)
{
    return knex.schema.createTable(topicStore.TABLE_NAME, function(table)
    {
        table.uuid('topicId').primary();
        table.string('topic');
        table.boolean('isActive');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
    });
}

function createSubscriptionsTable(knex)
{
    return knex.schema.createTable(subscriptionStore.TABLE_NAME, function(table)
    {
        table.uuid('subscriptionId').primary();
        table.boolean('topicId').references('topicId').inTable(topicStore.TABLE_NAME);
        table.string('subscriber');
        table.boolean('isDurable');
        table.boolean('isActive');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
    });
}

function createMessagesTable(knex)
{
    return knex.schema.createTable(messageStore.TABLE_NAME, function(table)
    {
        table.uuid('messageId').primary();
        table.boolean('topicId').references('topicId').inTable(topicStore.TABLE_NAME);
        table.string('publisher');
        table.boolean('isActive');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
    });
}

exports.up = function(knex, Promise)
{
    return Promise.all([
        createTopicsTable(knex),
        createSubscriptionsTable(knex),
        createMessagesTable(knex)
    ]);
};

exports.down = function(knex, Promise)
{
};
