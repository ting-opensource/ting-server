'use strict';

const Boom = require('boom');

const UploadFileCommand = require('../../commands/UploadFileCommand');

module.exports = function(request, reply)
{
    let filePayload = request.payload.file;

    if(!filePayload)
    {
        return reply(Boom.badRequest('file should be present as multipart-form post data'));
    }

    let command = new UploadFileCommand(filePayload);

    return command.execute()
    .then((response) =>
    {
        return reply(response);
    });
};
