'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');
const Promise = require('bluebird');

const clientBasicAuthenticationConfiguration = require('./configurations/clientBasicAuthenticationConfiguration');
const jwtAuthenticationConfiguration = require('./configurations/jwtAuthenticationConfiguration');

class AuthenticationFacade
{
    static signJWTToken(userId)
    {
        let token = jwt.sign({
            userId: userId
        }, config.get('auth.secret'), {
            expiresIn: '7d',
            issuer: 'ting-server',
            audience: 'ting-client'
        });

        return token;
    }

    static decodeJWTToken(token)
    {
        return jwt.verify(token, config.get('auth.secret'));
    }

    static configureAuthetnicationStrategies(server)
    {
        return Promise.all([
            server.register({
                register: require('hapi-auth-basic')
            })
                .then(() =>
                {
                    return server.auth.strategy('client', 'basic', false, clientBasicAuthenticationConfiguration);
                }),
            server.register({
                register: require('hapi-auth-jwt')
            })
                .then(() =>
                {
                    return server.auth.strategy('token', 'jwt', false, jwtAuthenticationConfiguration);
                })
        ])
        .then(() =>
        {
            return server;
        });
    }
}

module.exports = AuthenticationFacade;
