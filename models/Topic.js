'use strict';

const Immutable = require('immutable');

class Topic extends Immutable.Record({
    topicId: '',
    name: '',
    isActive: false,
    createdBy: '',
    createdAt: null, /* Moment */
    updatedBy: '',
    updatedAt: null /* Moment */
})
{
}

module.exports = Topic;
