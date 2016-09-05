'use strict';

const _ = require('lodash');

const RetrieveSubscriptionsForSubscriberCommand = require('../../commands/RetrieveSubscriptionsForSubscriberCommand');
const RetrieveMessagesForTopicCommand = require('../../commands/RetrieveMessagesForTopicCommand');
const logger = require('../../logging/logger');

module.exports = function(socket, next)
{
    let subscriber = socket.auth.credentials.userId;
    logger.info(`Hydrating Connections for Subscriber: ${subscriber}`);

    let command = new RetrieveSubscriptionsForSubscriberCommand(subscriber);
    return command.execute()
    .then((subscriptions) =>
    {
        let subscribedActiveTopics = subscriptions
        .toSeq()
        .filter((datum) =>
        {
            return datum.get('topic').get('isActive');
        })
        .map((datum) =>
        {
            return datum.get('topic');
        }).toArray();

        _.each(subscribedActiveTopics, (datum) =>
        {
            let topic = datum;
            let room = `/topics/${topic.get('name')}`;
            socket.join(room, () =>
            {
                let retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicCommand(topic);
                retrieveMessagesForTopicCommand.execute()
                .then((messages) =>
                {
                    messages
                    .toSeq()
                    .forEach((datum) =>
                    {
                        socket.emit('message', datum.toJS());
                    });
                });
            });
        });

        next();
    })
    .catch((error) =>
    {
        next(error);
    });
};
