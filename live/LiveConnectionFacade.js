'use strict';

const io = require('socket.io');

const RetrieveMessagesForTopicCommand = require('../commands/RetrieveMessagesForTopicCommand');

let _instance = null;
let _transport = null;
let _socketsMap = new Map();

class SingletonEnforcer {}

class LiveConnectionFacade
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
            _instance = new LiveConnectionFacade(new SingletonEnforcer());
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
        _transport.use(require('./middlewares/hydrateSubscriptions'));

        _transport.on('connection', require('./handlers/connection'));
    }

    setSocketForUserId(userId, socket)
    {
        _socketsMap.set(userId, socket);
    }

    getSocketForUserId(userId)
    {
        if(_socketsMap.has(userId))
        {
            return _socketsMap.get(userId);
        }
        else
        {
            return null;
        }
    }

    deleteSocketForUserId(userId)
    {
        if(_socketsMap.has(userId))
        {
            return _socketsMap.delete(userId);
        }
    }

    subscribeToUpdatesForTopic(socket, topic)
    {
        let room = `/topics/${topic.get('name')}`;
        socket.join(room, () =>
        {
            let retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicCommand(topic);
            retrieveMessagesForTopicCommand.execute()
            .then((messages) =>
            {
                messages
                .toSeq()
                .forEach((datum) =>
                {
                    socket.emit('message', datum.toJS());
                });
            });
        });
    }
}

module.exports = LiveConnectionFacade;
