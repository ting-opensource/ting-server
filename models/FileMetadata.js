'use strict';

const Immutable = require('immutable');

let defaultRecord = {
    key: '',
    originalName: '',
    contentType: '',
    url: '',
    createdAt: null, /* Moment */
    updatedAt: null /* Moment */
};

class FileMetadata extends Immutable.Record(defaultRecord)
{
}

module.exports = FileMetadata;
