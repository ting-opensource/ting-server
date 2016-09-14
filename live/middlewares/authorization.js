'use strict';

const Boom = require('Boom');
const jwt = require('jsonwebtoken');
const config = require('config');

const liveConnectionFacade = require('../LiveConnectionFacade').getInstance();
const logger = require('../../logging/logger');

module.exports = function(socket, next)
{
    logger.info(`Incoming Live Connection: ${socket.id}`);

    let token = socket.handshake.query.token;

    if(!token)
    {
        next(Boom.unauthorized('Authentication Token must be supplied as query parameter'));
    }
    else
    {
        try
        {
            let payload = jwt.verify(token, config.get('auth').get('secret'));

            let userId = payload.userId;
            logger.info(`User Identifier for Incoming Connection: ${userId}`);

            socket.isAuthenticated = true;
            socket.auth = {
                credentials: {
                    userId: userId
                }
            };

            socket.join(liveConnectionFacade.getRoomNameForUserId(userId), () =>
            {
                next();
            });
        }
        catch(error)
        {
            next(Boom.unauthorized('Invalid or Expired Authentication Token supplied'));
        }
    }
};
