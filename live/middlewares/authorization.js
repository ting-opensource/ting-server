'use strict';

const Boom = require('boom');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');

const liveConnectionFacade = require('../LiveConnectionFacade').getInstance();
const logger = require('../../logging/logger');

const BLACK_LISTED_IP_ADDRESSES = [
];

const BLACK_LISTED_USERS = [
];

module.exports = function(socket, next)
{
    let clientAddress = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

    logger.info(`Incoming Live Connection: ${socket.id} @ ${clientAddress}`);

    if(socket.handshake.headers['x-forwarded-for'])
    {
        logger.info(`Client @ ${socket.handshake.headers['x-forwarded-for']} Connecting via Proxy ${socket.request.connection.remoteAddress}`);
    }

    if(_.indexOf(BLACK_LISTED_IP_ADDRESSES, socket.request.connection.remoteAddress) > -1)
    {
        logger.warn(`Incoming connection from Blacklisted IP Address: ${socket.id} @ ${clientAddress}`);
        next(Boom.forbidden('Incoming connection from Blacklisted IP Address'));
        return;
    }

    let token = socket.handshake.query.token;

    if(!token)
    {
        logger.error(`No Authentication Token provided in Incoming connection from: ${socket.id} @ ${clientAddress}`);
        next(Boom.unauthorized('Authentication Token must be supplied as query parameter'));
    }
    else
    {
        try
        {
            let payload = jwt.verify(token, config.get('auth').get('secret'));

            let userId = payload.userId;
            logger.info(`User Identifier for Incoming Connection: ${userId}`);

            if(_.indexOf(BLACK_LISTED_USERS, userId) > -1)
            {
                logger.warn(`Connection from Blacklisted User: ${userId} from ${socket.id} @ ${clientAddress}`);
                next(Boom.forbidden('Incoming connection from Blacklisted User'));
                return;
            }

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
            logger.error(`Invalid or Expired Authentication Token supplied: ${socket.id} @ ${clientAddress}`);
            next(Boom.unauthorized('Invalid or Expired Authentication Token supplied'));
        }
    }
};
