'use strict';

const moment = require('moment');
const Promise = require('bluebird');

const AuthenticationFacade = require('../authentication/AuthenticationFacade');

class AuthenticationCommand
{
    constructor(userId)
    {
        this._userId = userId;
    }

    execute()
    {
        let userId = this._userId;

        return Promise.try(function()
        {
            let token = AuthenticationFacade.signJWTToken(userId);
            let decodedToken = AuthenticationFacade.decodeJWTToken(token);

            return {
                expiresAt: moment(decodedToken.exp * 1000),
                token: token,
                respondedAt: moment.utc()
            };
        });
    }
}

module.exports = AuthenticationCommand;
