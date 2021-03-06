'use strict';

import Assert from 'assert-js';
import {NetworkMessage} from 'nogame-common';
import {ClientMessages} from 'nogame-common';

export default class LoginCharacterMessage extends NetworkMessage
{
    /**
     * @param {string} characterId
     */
    constructor(characterId)
    {
        super();

        Assert.string(characterId);

        this._name = ClientMessages.LOGIN_CHARACTER;
        this._data = {characterId: characterId};
    }
}