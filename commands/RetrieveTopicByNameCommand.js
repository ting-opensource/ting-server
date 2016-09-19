'use strict';

const topicStore = require('../persistance/storage/TopicStore');

class RetriveTopicByNameCommand
{
    constructor(name)
    {
        this._name = name;
    }

    execute()
    {
        let name = this._name;

        return topicStore.retrieveByName(name);
    }
}

module.exports = RetriveTopicByNameCommand;
