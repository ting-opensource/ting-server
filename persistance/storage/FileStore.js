'use strict';

const fs = require('fs');
const config = require('config');
const uuid = require('uuid/v4');
const Promise = require('bluebird');

class FileStore
{
    create(filePayload)
    {
        return new Promise((resolve, reject) =>
        {
            let originalFileName = filePayload.hapi.filename;
            let uploadLocation = `${config.get('fileStorage.local.location')}/${uuid()}`;
            let savedFile = fs.createWriteStream(uploadLocation);

            savedFile.on('error', (error) =>
            {
                reject(error);
            });

            filePayload.on('end', () =>
            {
                resolve({
                    filename: originalFileName,
                    contentType: filePayload.hapi.headers['content-type']
                });
            });

            filePayload.pipe(savedFile);
        });
    }
}

module.exports = new FileStore();
