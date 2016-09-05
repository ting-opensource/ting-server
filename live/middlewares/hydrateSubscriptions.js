'use strict';

const _ = require('lodash');

const liveConnectionFacade = require('../LiveConnectionFacade').getInstance();
const RetrieveSubscriptionsForSubscriberCommand = require('../../commands/RetrieveSubscriptionsForSubscriberCommand');
const logger = require('../../logging/logger');

module.exports = function(socket, next)
{
    let subscriber = socket.auth.credentials.userId;
    logger.info(`Hydrating Connections for Subscriber: ${subscriber}`);

    let command = new RetrieveSubscriptionsForSubscriberCommand(subscriber);
    return command.execute()
    .then((subscriptions) =>
    {
        subscriptions
        .toSeq()
        .filter((datum) =>
        {
            return datum.get('topic').get('isActive');
        })
        .map((datum) =>
        {
            return datum.get('topic');
        })
        .forEach((datum) =>
        {
            liveConnectionFacade.subscribeToUpdatesForTopic(socket, datum);
        });

        next();
    })
    .catch((error) =>
    {
        next(error);
    });
};
