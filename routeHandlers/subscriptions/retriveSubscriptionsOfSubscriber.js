'use strict';

const _ = require('lodash');
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
            return reply(response.toJS());
        }
        else
        {
            return reply([]);
        }
    });
};
