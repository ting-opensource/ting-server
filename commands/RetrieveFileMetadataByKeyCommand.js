'use strict';

const fileMetadataStore = require('../persistance/storage/FileMetadataStore');

class RetrieveFileMetadataByKeyCommand
{
    constructor(key)
    {
        this._key = key;
    }

    execute()
    {
        let key = this._key;

        return fileMetadataStore.retrieveById(key);
    }
}

module.exports = RetrieveFileMetadataByKeyCommand;
