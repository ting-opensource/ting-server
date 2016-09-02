'use strict';

const Immutable = require('immutable');

class Topic extends Immutable.Record({
    topicId: '',
    name: '',
    isActive: false,
    createdAt: null, /* Moment */
    updatedAt: null /* Moment */
})
{
}

module.exports = Topic;
