'use strict';

const Boom = require('boom');

const UploadFileLocallyCommand = require('../../commands/UploadFileLocallyCommand');
const UploadFileInBlobStoreCommand = require('../../commands/UploadFileInBlobStoreCommand');

module.exports = function(request, reply)
{
    let filePayload = request.payload.file;

    if(!filePayload)
    {
        return reply(Boom.badRequest('file should be present as multipart-form post data'));
    }

    let command = new UploadFileInBlobStoreCommand(filePayload);

    return command.execute()
    .then((response) =>
    {
        return reply(response);
    })
    .catch((error) =>
    {
        console.error(error);
    });
};
