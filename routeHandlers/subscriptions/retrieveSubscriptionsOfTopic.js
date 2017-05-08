'use strict';

const Boom = require('boom');

const RetrieveTopicByNameCommand = require('../../commands/RetrieveTopicByNameCommand');
const RetrieveSubscriptionsForTopicCommand = require('../../commands/RetrieveSubscriptionsForTopicCommand');

module.exports = function(request, reply)
{
    let topicName = request.query.topic;
    let pageStart = request.query.pageStart ? parseInt(request.query.pageStart) : undefined;
    let pageSize = request.query.pageSize ? parseInt(request.query.pageSize) : undefined;

    if(!topicName)
    {
        return reply(Boom.badRequest('topic name is required to be passed as queryString parameter topic')); 
    }

    let retrieveTopicCommand = new RetrieveTopicByNameCommand(topicName);
    return retrieveTopicCommand.execute()
    .then((topic) =>
    {
        if(!topic)
        {
            return reply(Boom.notFound(`topic with name ${topicName} not found`));
        }
        else
        {
            let retrieveSubscriptionsCommand = new RetrieveSubscriptionsForTopicCommand(topic, pageStart, pageSize);
            return retrieveSubscriptionsCommand.execute();
        }
    })
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
