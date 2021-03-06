'use strict';

const Assert = require('assert-js');
const NetworkMessage = require('nogame-common').NetworkMessage;
const ServerMessages = require('nogame-common').ServerMessages;

class LoginAccountNotFoundMessage extends NetworkMessage
{
    constructor()
    {
        super();

        this._name = ServerMessages.LOGIN_ACCOUNT_NOT_FOUND;
        this._data = {};
    }
}

module.exports = LoginAccountNotFoundMessage;