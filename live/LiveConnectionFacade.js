'use strict';

const io = require('socket.io');
const _ = require('lodash');

const RetrieveMessagesForTopicCommand = require('../commands/RetrieveMessagesForTopicCommand');

let _instance = null;
let _transport = null;

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

        _transport.on('connect', require('./handlers/connect'));
    }

    getRoomNameForUserId(userId)
    {
        return `/user/${userId}`;
    }

    getRoomNameForTopic(topic)
    {
        return `/topics/${topic.get('name')}`;
    }

    getSocketsForUserId(userId)
    {
        let namespace = _transport.of('/');
        let matchingSockets = _.filter(namespace.sockets, (datum) =>
        {
            if(datum.isAuthenticated)
            {
                return datum.auth.credentials.userId === userId;
            }

            return false;
        });

        return matchingSockets || [];
    }

    subscribeToUpdatesForTopicBySocket(socket, topic)
    {
        let room = this.getRoomNameForTopic(topic);
        socket.join(room, () =>
        {
            socket.emit('subscription-live', topic.toJS());

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

    subscribeToUpdatesForTopicByUserId(userId, topic)
    {
        let room = this.getRoomNameForTopic(topic);

        let joinCallback = _.once(() =>
        {
            let roomForUserId = this.getRoomNameForUserId(userId);
            _transport.to(roomForUserId).emit('subscription-live', topic.toJS());

            let retrieveMessagesForTopicCommand = new RetrieveMessagesForTopicCommand(topic);
            retrieveMessagesForTopicCommand.execute()
            .then((messages) =>
            {
                messages
                .toSeq()
                .forEach((datum) =>
                {
                    _transport.to(roomForUserId).emit('message', datum.toJS());
                });
            });
        });

        let socketsForSubscriber = this.getSocketsForUserId(userId);
        _.forEach(socketsForSubscriber, (datum) =>
        {
            datum.join(room, joinCallback);
        });
    }

    unsubscribeFromUpdatesForTopicBySocket(socket, topic)
    {
        let room = this.getRoomNameForTopic(topic);
        socket.leave(room);

        socket.emit('subscription-off', topic.toJS());
    }

    unsubscribeFromUpdatesForTopicByUserId(userId, topic)
    {
        let room = this.getRoomNameForTopic(topic);

        let socketsForSubscriber = this.getSocketsForUserId(userId);
        _.forEach(socketsForSubscriber, (datum) =>
        {
            datum.leave(room);
        });

        let roomForUserId = this.getRoomNameForUserId(userId);
        _transport.to(roomForUserId).emit('subscription-off', topic.toJS());
    }

    publishMessageForTopicBySocket(socket, topic, message)
    {
        let room = this.getRoomNameForTopic(topic);

        socket.broadcast.to(room).emit('message', message.toJS());
    }

    publishMessageForTopic(topic, message)
    {
        let room = this.getRoomNameForTopic(topic);

        _transport.to(room).emit('message', message.toJS());
    }
}

module.exports = LiveConnectionFacade;
