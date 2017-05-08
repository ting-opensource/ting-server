'use strict';

const Promise = require('bluebird');

const FileStorageTypes = require('../../models/FileStorageTypes');
const RetrieveFileMetadataByKeyCommand = require('../../commands/RetrieveFileMetadataByKeyCommand');
const blobStore = require('../../persistance/storage/BlobStore');
const fileStore = require('../../persistance/storage/FileStore');

module.exports = function(request, reply)
{
    let fileKey = request.params.key;

    let command = new RetrieveFileMetadataByKeyCommand(fileKey);

    return command.execute()
    .then((fileMetadata) =>
    {
        if(fileMetadata.storageType === FileStorageTypes.BLOBSTORE)
        {
            return blobStore.retrieveByKey(fileMetadata.key)
            .then((fileStream) =>
            {
                // wrapping fileStream around a promise to be able to set headers!
                let fileStreamPromise = Promise.resolve(fileStream);

                let response = reply(fileStreamPromise)
                .header('Content-Type', fileMetadata.contentType ? fileMetadata.contentType : 'application/octet-stream')
                .header('Content-Disposition', `attachment; filename=${fileMetadata.originalName}`);

                return response;
            });
        }
        else if(fileMetadata.storageType === FileStorageTypes.LOCAL)
        {
            return fileStore.retrieveByKey(fileMetadata.key)
            .then((fileStream) =>
            {
                // wrapping fileStream around a promise to be able to set headers!
                let fileStreamPromise = Promise.resolve(fileStream);

                let response = reply(fileStreamPromise)
                .header('Content-Type', fileMetadata.contentType ? fileMetadata.contentType : 'application/octet-stream')
                .header('Content-Disposition', `attachment; filename=${fileMetadata.originalName}`);

                return response;
            });
        }
    });
};
