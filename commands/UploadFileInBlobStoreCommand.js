'use strict';

const blobStore = require('../persistance/storage/BlobStore');

class UploadFileInBlobStoreCommand
{
    constructor(filePayload)
    {
        this._filePayload = filePayload;
    }

    execute()
    {
        let filePayload = this._filePayload;

        return blobStore.create(filePayload)
        .then((uploadedFileDetails) =>
        {
            return uploadedFileDetails;
        });
    }
}

module.exports = UploadFileInBlobStoreCommand;
