'use strict';

const moment = require('moment');
const Promise = require('bluebird');

const Authenticator = require('../auth/Authenticator');

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
            let token = Authenticator.generateToken(userId);
            return {
                token: token,
                respondedAt: moment.utc()
            };
        });
    }
}

module.exports = AuthenticationCommand;
