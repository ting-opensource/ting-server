'use strict';

const liveConnectionFacade = require('../LiveConnectionFacade').getInstance();
const RetrieveSubscriptionsForSubscriberCommand = require('../../commands/RetrieveSubscriptionsForSubscriberCommand');
const logger = require('../../logging/logger');

module.exports = function(socket)
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
            return datum.get('isActive') && datum.get('topic').get('isActive');
        })
        .map((datum) =>
        {
            return datum.get('topic');
        })
        .forEach((datum) =>
        {
            liveConnectionFacade.subscribeToUpdatesForTopicBySocket(socket, datum);
        });

        logger.info(`Connections Hydration for Subscriber ${subscriber} done`);
    })
    .error((error) =>
    {
        logger.error(`Not able to hydrate connections for Subscriber: ${subscriber}`);
        logger.error(error);
    });
};
