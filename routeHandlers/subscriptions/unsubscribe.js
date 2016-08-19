'use strict';

const Boom = require('boom');

const Subscription = require('../../models/Subscription');
const Topic = require('../../models/Topic');

const RetrieveTopicByNameCommand = require('../../commands/RetrieveTopicByNameCommand');
const DeactivateSubscriptionCommand = require('../../commands/DeactivateSubscriptionCommand');

module.exports = function(request, reply)
{
    let subscriber = request.query.subscriber;
    let topicName = request.payload.topic.name;

    let retrieveTopicCommand = new RetrieveTopicByNameCommand(topicName);

    return retrieveTopicCommand.execute()
    .then((topic) =>
    {
        if(topic)
        {
            return topic;
        }
        else
        {
            return reply(Boom.notFound(`subscription for topic ${topicName} not found`))
            .then(() =>
            {
                throw new Error('topic not found');
            });
        }
    })
    .then((topic) =>
    {
        let subscription = new Subscription({
            subscriber: subscriber,
            topic: topic,
            isActive: true,
            isDurable: true
        });

        let deactivateSubscriptionCommand = new DeactivateSubscriptionCommand(subscription);

        return deactivateSubscriptionCommand.execute();
    })
    .then((response) =>
    {
        return reply(response.toJS());
    });
}
