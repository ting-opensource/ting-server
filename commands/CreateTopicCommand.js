'use strict';

const topicStore = require('../persistance/storage/TopicStore');

class CreateTopicCommand
{
    constructor(topic)
    {
        this._topic = topic;
    }

    execute()
    {
        let topic = this._topic;

        return topicStore.create(topic)
            .then(function(updatedTopic)
            {
                return updatedTopic;
            });
    }
}

module.exports = CreateTopicCommand;
