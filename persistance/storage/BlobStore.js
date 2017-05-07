'use strict';

const Promise = require('bluebird');
const config = require('config');
const uuid = require('uuid/v4');
const aws = require('aws-sdk');

const FileMetadata = require('../../models/FileMetadata');
const fileMetadataStore = require('./FileMetadataStore');

class BlobStore
{
    create(filePayload)
    {
        let originalFileName = filePayload.hapi.filename;
        let contentType = filePayload.hapi.headers['content-type'];
        let uploadedFileName = `${uuid()}_file_${originalFileName}`;

        let endpoint = new aws.Endpoint(config.get('fileStorage.blobStore.url'));

        let s3 = new aws.S3({
            accessKeyId: config.get('fileStorage.blobStore.accessKeyId'),
            secretAccessKey: config.get('fileStorage.blobStore.secretAccessKey'),
            endpoint: endpoint
        });

        let s3UploadParams = {
            Bucket: config.get('fileStorage.blobStore.bucketName'),
            Key: uploadedFileName,
            Body: filePayload,
            ContentType: contentType,
            ACL: 'public-read'
        };
        const upload = Promise.promisify(s3.upload, {context: s3});

        return upload(s3UploadParams)
        .then((response) =>
        {
            let fileMetadata = new FileMetadata({
                key: uploadedFileName,
                originalName: originalFileName,
                contentType: contentType,
                storageType: 'BLOBSTORE',
                url: response.Location
            });

            return fileMetadataStore.create(fileMetadata);
        });
    }
}

module.exports = new BlobStore();
