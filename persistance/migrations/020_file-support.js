'use strict';

const fileMetadataStore = require('../storage/FileMetadataStore');

function createFileMetadataTable(knex)
{
    return knex.schema.createTable(fileMetadataStore.TABLE_NAME, function(table)
    {
        table.string('key', 256).primary();
        table.string('originalName', 1024);
        table.string('contentType');
        table.string('storageType');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
    });
}

exports.up = function(knex, Promise)
{
    return Promise.all([
        createFileMetadataTable(knex)
    ]);
};

exports.down = function(knex, Promise)
{
};
