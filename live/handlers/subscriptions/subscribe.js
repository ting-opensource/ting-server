'use strict';

const SubscribeToTopicNameCommand = require('../../../commands/SubscribeToTopicNameCommand');

module.exports = function(data)
{
    let socket = this;

    let subscriber = socket.auth.credentials.userId;
    let topicName = data.topic.name;
    let createTopicIfNotExist = data.topic.createIfNotExist;

    let command = new SubscribeToTopicNameCommand(subscriber, topicName, createTopicIfNotExist);
    command.execute()
    .then((subscription) =>
    {
        socket.emit('subscription-success', subscription.toJS());
    })
    .catch((error) =>
    {
        socket.emit('subscription-error', error.isBoom ? error.output : error.message);
    });
};
