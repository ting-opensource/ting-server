'use strict';

const topicStore = require('../storage/TopicStore');
const subscriptionStore = require('../storage/SubscriptionStore');
const messageStore = require('../storage/MessageStore');

function createTopicsTable(knex)
{
    return knex.schema.createTable(topicStore.TABLE_NAME, function(table)
    {
        table.uuid('topicId').primary();
        table.string('name', 1024);
        table.boolean('isActive');
        table.string('createdBy', 256);
        table.timestamp('createdAt');
        table.string('updatedBy', 256);
        table.timestamp('updatedAt');
    });
}

function createSubscriptionsTable(knex)
{
    return knex.schema.createTable(subscriptionStore.TABLE_NAME, function(table)
    {
        table.uuid('subscriptionId').primary();
        table.boolean('topicId').references('topicId').inTable(topicStore.TABLE_NAME);
        table.string('subscriber', 256);
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
        table.string('publisher', 256);
        table.string('type', 256);
        table.string('body', 4096);
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
