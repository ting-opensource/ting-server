'use strict';

const _ = require('lodash');
const Topic = require('../../models/Topic');
const RetrieveSubscriptionsForSubscriberCommand = require('../../commands/RetrieveSubscriptionsForSubscriberCommand');

module.exports = function(request, reply)
{
    let subscriber = request.query.subscriber;

    let command = new RetrieveSubscriptionsForSubscriberCommand(subscriber);
    return command.execute()
    .then((response) =>
    {
        if(response)
        {
            return reply(_.map(response, (currentSubscription) =>
            {
                return currentSubscription.toJS();
            }));
        }
        else
        {
            return reply([]);
        }
    });
}
