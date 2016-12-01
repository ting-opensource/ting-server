'use strict';

const Boom = require('boom');

const Topic = require('../models/Topic').default;
const RetrieveTopicByNameCommand = require('./RetrieveTopicByNameCommand');
const CreateTopicCommand = require('./CreateTopicCommand');

class CreateTopicByNameCommand
{
    constructor(topicName, requestedBy)
    {
        this._topicName = topicName;
        this._requestedBy = requestedBy;
    }

    execute()
    {
        let topicName = this._topicName;
        let requestedBy = this._requestedBy;

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
                    createdBy: requestedBy,
                    updatedBy: requestedBy,
                    isActive: true
                });

                let createTopicCommand = new CreateTopicCommand(topic);

                return createTopicCommand.execute();
            }
        });
    }
}

module.exports = CreateTopicByNameCommand;
