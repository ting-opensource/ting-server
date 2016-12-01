'use strict';

const readReceiptStore = require('../storage/ReadReceiptStore');
const messageStore = require('../storage/MessageStore');

function createReadReceiptsTable(knex)
{
    return knex.schema.createTable(readReceiptStore.TABLE_NAME, function(table)
    {
        table.uuid('messageId').references('messageId').inTable(messageStore.TABLE_NAME);
        table.string('subscriber', 256);
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
        table.unique(['messageId', 'subscriber']);
    });
}

exports.up = function(knex, Promise)
{
    return Promise.all([
        createReadReceiptsTable(knex)
    ]);
};

exports.down = function(knex, Promise)
{
};
