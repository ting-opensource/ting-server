'use strict';

const UnsubscribeFromTopicNameCommand = require('../../commands/UnsubscribeFromTopicNameCommand');

module.exports = function(data)
{
    let socket = this;

    let subscriber = socket.auth.credentials.userId;
    let topicName = data.topic.name;

    let command = new UnsubscribeFromTopicNameCommand(subscriber, topicName);
    return command.execute()
    .then((subscription) =>
    {
        socket.emit('unsubscription-success', subscription.toJS());
    })
    .catch((error) =>
    {
        socket.emit('unsubscription-error', error.isBoom ? error.output : error.message);
    });
};
