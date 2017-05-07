'use strict';

const Boom = require('boom');
const _ = require('lodash');

const UploadFileInBlobStoreCommand = require('../../commands/UploadFileInBlobStoreCommand');
const MessageTypes = require('../../models/MessageTypes');
const PublishMessageForTopicNameCommand = require('../../commands/PublishMessageForTopicNameCommand');

module.exports = function(request, reply)
{
    let publisher = request.auth.credentials.userId;
    let topicName = request.payload.topicName;
    let createTopicIfNotExist = request.payload.createTopicIfNotExist;

    let filePayload = request.payload.file;

    if(!filePayload)
    {
        return reply(Boom.badRequest('file should be present as multipart-form post data  with parameter name file'));
    }

    if(_.isArray(filePayload))
    {
        return reply(Boom.badRequest('only single file is supported and it should be present as multipart-form post data with parameter name file'));
    }

    let uploadFileCommand = new UploadFileInBlobStoreCommand(filePayload);

    return uploadFileCommand.execute()
    .then((fileMetadata) =>
    {
        let serializedFileMetadata = _.omit(fileMetadata.toJS(), 'url', 'storageType');
        let messageBody = JSON.stringify(serializedFileMetadata);
        let messageType = MessageTypes.FILE;

        let publishMessageCommand = new PublishMessageForTopicNameCommand(publisher, topicName, createTopicIfNotExist, messageBody, messageType);
        return publishMessageCommand.execute();
    })
    .then((response) =>
    {
        return reply(response);
    });
};
