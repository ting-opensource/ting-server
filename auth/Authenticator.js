'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');

class Authenticator
{
    static generateToken(userId)
    {
        let token = jwt.sign({
            userId: userId
        }, config.get('auth').get('secret'), {
            expiresIn: '7d',
            issuer: 'ting-server',
            audience: 'ting-client'
        });

        return token;
    }
}

module.exports = Authenticator;
