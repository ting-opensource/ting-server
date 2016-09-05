'use strict';

const io = require('socket.io');

let _instance = null;
let _transport = null;

class SingletonEnforcer {}

class ConnectionManager
{
    constructor(enforcer)
    {
        if(!enforcer || !(enforcer instanceof SingletonEnforcer))
        {
            throw new Error(`This is a Singleton Class. Use getInstance() method instead.`);
        }
    }

    static getInstance()
    {
        if(!_instance)
        {
            _instance = new ConnectionManager(new SingletonEnforcer());
        }

        return _instance;
    }

    get transport()
    {
        return _transport;
    }

    initializeWithServer(server)
    {
        _transport = io(server, {
            path: '/live'
        });

        _transport.use(require('./middlewares/authorization'));

        _transport.on('connection', require('./handlers/connection'));
    }

    subscribe()
    {

    }
}

module.exports = ConnectionManager;
