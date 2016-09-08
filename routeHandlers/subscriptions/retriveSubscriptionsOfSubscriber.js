'use strict';

const Boom = require('boom');

const RetrieveSubscriptionsForSubscriberCommand = require('../../commands/RetrieveSubscriptionsForSubscriberCommand');

module.exports = function(request, reply)
{
    let subscriber = request.auth.credentials.userId;

    let command = new RetrieveSubscriptionsForSubscriberCommand(subscriber);
    return command.execute()
    .then((response) =>
    {
        if(response)
        {
            return reply(response.toJS());
        }
        else
        {
            return reply([]);
        }
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
