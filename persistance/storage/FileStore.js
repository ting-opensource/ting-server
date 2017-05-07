'use strict';

const fs = require('fs');
const config = require('config');
const uuid = require('uuid/v4');
const Promise = require('bluebird');

const FileMetadata = require('../../models/FileMetadata');
const fileMetadataStore = require('./FileMetadataStore');

class FileStore
{
    create(filePayload)
    {
        return new Promise((resolve, reject) =>
        {
            let originalFileName = filePayload.hapi.filename;
            let contentType = filePayload.hapi.headers['content-type'];
            let uploadedFileName = `${uuid()}_file_${originalFileName}`;

            let uploadLocation = `${config.get('fileStorage.local.location')}/${uploadedFileName}`;
            let savedFile = fs.createWriteStream(uploadLocation);

            savedFile.on('error', (error) =>
            {
                reject(error);
            });

            filePayload.on('end', () =>
            {
                let fileMetadata = new FileMetadata({
                    key: uploadedFileName,
                    originalName: originalFileName,
                    contentType: contentType,
                    storageType: 'LOCAL',
                    url: ''
                });
                resolve(fileMetadata);
            });

            filePayload.pipe(savedFile);
        })
        .then((fileMetadata) =>
        {
            return fileMetadataStore.create(fileMetadata);
        });
    }
}

module.exports = new FileStore();
