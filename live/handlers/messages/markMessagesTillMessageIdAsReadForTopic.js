'use strict';

const _ = require('lodash');

const MarkMessagesAsReadCommand = require('../../../commands/MarkMessagesAsReadCommand');

module.exports = function(data)
{
    let socket = this;

    let subscriber = socket.auth.credentials.userId;
    let tillMessageId = data.tillMessageId;

    let command = new MarkMessagesAsReadCommand(subscriber, '', '', tillMessageId);
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

        socket.emit('mark-messages-as-read-success', readReceipts);
    })
    .catch((error) =>
    {
        socket.emit('mark-messages-as-read-error', error.isBoom ? error.output : error.message);
    });
};
