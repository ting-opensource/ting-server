'use strict';

class MessageTypes
{
    static get TEXT()
    {
        return 'text/plain';
    }

    static get HTML()
    {
        return 'text/html';
    }

    static get JSON()
    {
        return 'application/json';
    }
}

module.exports = MessageTypes;
