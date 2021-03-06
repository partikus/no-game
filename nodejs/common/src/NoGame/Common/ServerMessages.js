'use strict';

const ServerMessages = {
    BATCH_MESSAGE: 'batch',

    LOGIN: 'login',
    LOGIN_CHARACTER_LIST: 'login_character_list',
    LOGIN_ACCOUNT_NOT_FOUND: 'login_account_not_found',
    LOGOUT: 'logout',

    AREA: 'area',
    TILE: 'tile',
    TILES: 'tiles',

    CHARACTERS: 'characters',
    CHARACTER_LOGOUT: 'character_logout',
    CHARACTER_MOVE: 'character_move',
    CHARACTER_SAY: 'character_say',
    CHARACTER_HEALTH: 'character_health',
    CHARACTER_DIED: 'character_died',
    CHARACTER_PARRY: 'character_parry',

    MONSTER_MOVE: 'monster_move',
    MONSTER_ATTACK: 'monster_attack',

    PLAYER_MOVE: 'move',
    PLAYER_EARN_EXPERIENCE: 'player_earn_experience'
};

module.exports = ServerMessages;