'use strict';

const Boom = require('boom');
const moment = require('moment');

const RetrieveMessagesForTopicNameCommand = require('../../commands/RetrieveMessagesForTopicNameCommand');

module.exports = function(request, reply)
{
    let subscriber = request.query.subscriber;
    let topicName = request.query.topic;

    let tillTime = request.query.tillTime ? moment.utc(request.query.tillTime, moment.ISO_8601) : null;
    let sinceTime = request.query.sinceTime ? moment.utc(request.query.sinceTime, moment.ISO_8601) : null;
    let sinceMessageId = request.query.sinceMessageId;
    let tillMessageId = request.query.tillMessageId;

    let command = new RetrieveMessagesForTopicNameCommand(subscriber, topicName, tillTime, sinceTime, sinceMessageId, tillMessageId);
    return command.execute()
    .then((response) =>
    {
        return reply(response.toJS());
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