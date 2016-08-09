'use strict';

const _ = require('lodash');
const moment = require('moment');

const logger = require('../../logging/logger');

class TopicStore
{
    get TABLE_NAME()
    {
        return 'topics';
    }
}

module.exports = new TopicStore();
