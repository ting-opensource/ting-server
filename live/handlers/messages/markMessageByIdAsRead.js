'use strict';

const _ = require('lodash');

const MarkMessagesAsReadCommand = require('../../../commands/MarkMessagesAsReadCommand');

module.exports = function(data)
{
    let socket = this;

    let subscriber = socket.auth.credentials.userId;
    let messageId = data.messageId;

    let command = new MarkMessagesAsReadCommand(subscriber, messageId);
    return command.execute()
    .then((response) =>
    {
        let readReceipt = response.toJS();
        readReceipt = _.chain()
                      .omit('createdAt', 'updatedAt')
                      .extend({
                          readOn: readReceipt.updatedAt
                      })
                      .value();

        socket.emit('mark-message-as-read-success', readReceipt.toJS());
    })
    .catch((error) =>
    {
        socket.emit('mark-message-as-read-error', error.isBoom ? error.output : error.message);
    });
};
