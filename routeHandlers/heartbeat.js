'use strict';

const Boom = require('boom');
const _ = require('lodash');
const moment = require('moment');

module.exports = function(request, reply)
{
    let requestId = request.query.requestId;

    if(!requestId)
    {
        return reply(Boom.badRequest('requestId should be present as query string parameter'));
    }

    return reply({
        requestId: requestId,
        respondedAt: moment.utc()
    });
}
