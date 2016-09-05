'use strict';

const Boom = require('boom');

const Topic = require('../models/Topic');
const RetrieveTopicByNameCommand = require('./RetrieveTopicByNameCommand');
const CreateTopicCommand = require('./CreateTopicCommand');

class CreateTopicByNameCommand
{
    constructor(topicName)
    {
        this._topicName = topicName;
    }

    execute()
    {
        let topicName = this._topicName;

        let retrieveTopicCommand = new RetrieveTopicByNameCommand(topicName);

        return retrieveTopicCommand.execute()
        .then((topic) =>
        {
            if(topic)
            {
                throw Boom.conflict(`topic with ${topicName} already exists`);
            }
            else
            {
                let topic = new Topic({
                    name: topicName,
                    isActive: true
                });

                let createTopicCommand = new CreateTopicCommand(topic);

                return createTopicCommand.execute();
            }
        });
    }
}

module.exports = CreateTopicByNameCommand;
