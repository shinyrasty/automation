const fs = require("fs");
const uuid = require("uuid");
require('dotenv').config();

function date() {
    return Date.now() + 60 * 1000;
}
function getPsrityHost(){
    return process.env.PARITY_HOST
}
function updateAccessToken(newAccessToken) {
    process.env.ACCESS_TOKEN = newAccessToken;
}

function getProfileId() {
    return process.env.PROFILE_ID;
}
function getAccountId() {
    return process.env.ACCOUNT_ID;
}
function namer(starter) {
    const rand = Math.random().toString(36).substring(7);
    return `${starter}${rand}`;
}


function getAccessTokenExpiration() {
    return process.env.ACCESS_TOKEN_EXPIRATION_IN_MINUTES || `${date()}`;
}

module.exports = {
    url: process.env.BASE_URL, // || 'https://api.test6.localcoin.com/0.1/',//ToDo change to passble argument
    getAccountId, // || '5b3b4cab758205b6dc648c6e',
    getPsrityHost,
    getProfileId, // || '5b3b52d95238244b43bdf49b',
    profileIdWallet: process.env.PROFILE_WALLET, // {"version":3,"id":"0fef6fae-ff2d-4c3f-bb1b-c366939f6e20","address":"a8bc1cae792362998ba97c35a66bbac7121994ca","crypto":{"ciphertext":"731a3a2c57ee4510edcf6650e0d5f839c76190385e1a8c744f7ac3907005ffef","cipherparams":{"iv":"212c4765576dbef3a88e7f7a97de2365"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"9e9c10621a15e70c342a496a7578804c731d444ff20b3f69fc6915dbac27436b","n":262144,"r":8,"p":1},"mac":"aaca877988402381aa5c46c5e33b424f4dc5363dfe3476cfde187de6845c641b"}}
    walletPassword: process.env.WALLET_PASSWORD, // '123123123'
    mongoDbUrl: process.env.MONGODB_URL, // ||'localhost:27017',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET, // || 'fgnhjFRY%WEc5ry76NBSFGDF&',
    getAccessTokenExpiration,
    updateAccessToken,
    namer
};
