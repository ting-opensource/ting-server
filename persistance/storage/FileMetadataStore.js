'use strict';

const _ = require('lodash');
const moment = require('moment');
const Immutable = require('immutable');
const config = require('config');

const knex = require('../knex');
const FileMetadata = require('../../models/FileMetadata');

class FileMetadataStore
{
    get TABLE_NAME()
    {
        return 'files_metadata';
    }

    _serialize(fileMetadata)
    {
        let serializedData = _.omit(fileMetadata.toJS(), 'url');

        _.extend(serializedData, {
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    _deserialize(fileMetadataData)
    {
        let serializedData = fileMetadataData;

        return new FileMetadata(_.extend(serializedData, {
            createdAt: moment.utc(serializedData.createdAt),
            updatedAt: moment.utc(serializedData.updatedAt)
        }));
    }

    _adaptDataStoreRows(rows)
    {
        let fileMetadatas = [];

        if(rows.length)
        {
            fileMetadatas = _.map(rows, (currentRow) =>
            {
                return this._deserialize(currentRow);
            });

            return new Immutable.List(fileMetadatas);
        }
        else
        {
            return new Immutable.List(fileMetadatas);
        }
    }

    create(fileMetadata, tx)
    {
        let timestamp = moment.utc();

        fileMetadata = fileMetadata.merge({
            createdAt: timestamp,
            updatedAt: timestamp
        });

        let serializedData = this._serialize(fileMetadata);

        let queryBuilder = knex.withSchema(config.get('dataStore').get('postgres').get('schema')).insert(serializedData).into(this.TABLE_NAME);

        if(tx)
        {
            queryBuilder = queryBuilder.transacting(tx);
        }

        return queryBuilder
        .then(() =>
        {
            return fileMetadata;
        });
    }

    retrieveById(key)
    {
        return this.retrieveByIds([key])
        .then((fileMetadatas) =>
        {
            return fileMetadatas.size ? fileMetadatas.first() : null;
        });
    }

    retrieveByIds(keys)
    {
        return knex.withSchema(config.get('dataStore').get('postgres').get('schema')).select('*').from(this.TABLE_NAME)
        .whereIn('key', keys)
        .orderBy('updatedAt', 'desc')
        .then((rows) =>
        {
            return this._adaptDataStoreRows(rows);
        });
    }
}

module.exports = new FileMetadataStore();
