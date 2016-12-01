'use strict';

const _ = require('lodash');
const Boom = require('boom');

const MarkMessagesAsReadCommand = require('../../commands/MarkMessagesAsReadCommand');

module.exports = function(request, reply)
{
    let subscriber = request.auth.credentials.userId;
    let messageId = request.params.messageId;

    let command = new MarkMessagesAsReadCommand(subscriber, messageId);
    return command.execute()
    .then((response) =>
    {
        let readReceipt = response.toJS();
        readReceipt = _.chain(readReceipt)
                      .omit('createdAt', 'updatedAt')
                      .extend({
                          readOn: readReceipt.updatedAt
                      })
                      .value();

        return reply(readReceipt);
    })
    .catch((error) =>
    {
        if(error.isBoom)
        {
            return reply(error);
        }
        else
        {
            return reply(Boom.wrap(error, 500));
        }
    });
};
