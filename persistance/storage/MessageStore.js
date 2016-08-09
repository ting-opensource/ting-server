'use strict';

const _ = require('lodash');
const moment = require('moment');

const logger = require('../../logging/logger');

class MessageStore
{
    get TABLE_NAME()
    {
        return 'messages';
    }
}

module.exports = new MessageStore();
