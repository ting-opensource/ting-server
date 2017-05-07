'use strict';

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
                return reply(fileStream);
            });
        }
        else if(fileMetadata.storageType === FileStorageTypes.LOCAL)
        {
            return fileStore.retrieveByKey(fileMetadata.key)
            .then((fileStream) =>
            {
                return reply(fileStream);
            });
        }
    });
};
