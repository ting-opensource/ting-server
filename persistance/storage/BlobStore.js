'use strict';

const Promise = require('bluebird');
const config = require('config');
const uuid = require('uuid/v4');
const aws = require('aws-sdk');

const readFile = Promise.promisify(require('fs').readFile);

aws.config.update({
    accessKeyId: config.get('fileStorage.blobStore.accessKeyId'),
    secretAccessKey: config.get('fileStorage.blobStore.secretAccessKey')
});

class BlobStore
{
    create(filePayload)
    {
        let originalFileName = filePayload.hapi.filename;

        let s3 = new aws.S3();
        let s3UploadParams = {
            Bucket: config.get('fileStorage.blobStore.bucketName'),
            Key: `${uuid()}_file_${originalFileName}`,
            Body: filePayload,
            ACL: 'public-read'
        };
        const upload = Promise.promisify(s3.upload, {context: s3});

        return upload(s3UploadParams);
    }
}

module.exports = new BlobStore();
