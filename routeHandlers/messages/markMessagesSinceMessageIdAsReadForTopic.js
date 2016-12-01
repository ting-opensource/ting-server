'use strict';

const _ = require('lodash');
const Boom = require('boom');

const MarkMessagesAsReadCommand = require('../../commands/MarkMessagesAsReadCommand');

module.exports = function(request, reply)
{
    let subscriber = request.auth.credentials.userId;
    let sinceMessageId = request.params.sinceMessageId;

    let command = new MarkMessagesAsReadCommand(subscriber, '', sinceMessageId, '');
    return command.execute()
    .then((response) =>
    {
        let readReceipts = _.map(response, (datum) =>
        {
            let readReceipt = datum.toJS();
            return _.chain(readReceipt)
                      .omit('createdAt', 'updatedAt')
                      .extend({
                          readOn: readReceipt.updatedAt
                      })
                      .value();
        });

        return reply(readReceipts);
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
