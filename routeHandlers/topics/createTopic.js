'use strict';

const Boom = require('boom');

const Topic = require('../../models/Topic');
const RetrieveTopicByNameCommand = require('../../commands/RetrieveTopicByNameCommand');
const CreateTopicCommand = require('../../commands/CreateTopicCommand');

module.exports = function(request, reply)
{
    let name = request.payload.name;

    let retrieveTopicCommand = new RetrieveTopicByNameCommand(name);

    return retrieveTopicCommand.execute()
    .then((topic) =>
    {
        if(topic)
        {
            return reply(Boom.conflict(`topic with ${name} already exists`))
            .then(() =>
            {
                throw new Error('topic not found');
            });
        }
        else
        {
            let topic = new Topic({
                name: name,
                isActive: true
            });

            let createTopicCommand = new CreateTopicCommand(topic);

            return createTopicCommand.execute();
        }
    })
    .then((response) =>
    {
        return reply(response.toJS());
    });
}
