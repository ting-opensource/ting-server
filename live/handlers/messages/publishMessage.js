'use strict';

const PublishMessageForTopicNameCommand = require('../../../commands/PublishMessageForTopicNameCommand');

module.exports = function(data)
{
    let socket = this;

    let publisher = socket.auth.credentials.userId;
    let topicName = data.topic.name;
    let createTopicIfNotExist = data.topic.createIfNotExist;
    let messageType = data.message.type;
    let messageBody = data.message.body;

    let command = new PublishMessageForTopicNameCommand(publisher, topicName, createTopicIfNotExist, messageBody, messageType);
    return command.execute()
    .then((message) =>
    {
        socket.emit('publish-message-success', message.toJS());
    })
    .catch((error) =>
    {
        socket.emit('publish-message-error', error.isBoom ? error.output : error.message);
    });
};
