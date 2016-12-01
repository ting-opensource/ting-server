'use strict';

const Immutable = require('immutable');

let defaultRecord = {
    topicId: '',
    name: '',
    isActive: false,
    createdBy: '',
    createdAt: null, /* Moment */
    updatedBy: '',
    updatedAt: null /* Moment */
};

class Topic extends Immutable.Record(defaultRecord)
{
}

module.exports.defaultRecord = defaultRecord;
module.exports.default = Topic;
