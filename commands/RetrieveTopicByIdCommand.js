'use strict';

const topicStore = require('../persistance/storage/TopicStore');

class RetriveTopicByIdCommand
{
    constructor(topicId)
    {
        this._topicId = topicId;
    }

    execute()
    {
        let topicId = this._topicId;

        return topicStore.retrieveById(topicId);
    }
}

module.exports = RetriveTopicByIdCommand;
