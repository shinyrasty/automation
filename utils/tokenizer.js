const commons = require('./commons');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

function generateToken() {
    const { getAccountId, getProfileId, getAccessTokenExpiration, accessTokenSecret } = commons;
    const tokenData = {
        version: 1,
        type: 'user',
        custom: {
            accountId: getAccountId(),
            profileId: getProfileId()
        }
    };
    const jwtId = uuid.v1();
    return jwt.sign(tokenData, accessTokenSecret, {
        expiresIn: getAccessTokenExpiration(),
        jwtid: jwtId
    });
}

module.exports = {
    generateToken
};

