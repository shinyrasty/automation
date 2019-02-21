const commons = require('./commons')
const Promise = require('es6-promise');
const EthereumUtils = require('ethereumjs-util');
const EthereumWallet = require('ethereumjs-wallet');
const EthereumTx = require('ethereumjs-tx');
const atob = require('atob');
const btoa = require('btoa');
const bip39 = require('bip39');
// const hdkey = require('ethereumjs-wallet/hdkey');
const crypto = require('crypto')
const Web3 = require('web3')
const _ = require('lodash')
// const Encryption = require('@bancor/server-utils')
const parityHost = commons.getPsrityHost()
// const encLib = Encryption.encryption;
const { MultiBlockchainWallet } = require('multi-blockchain-wallet/dist/index.node.js')
const secret = 'bbcd8381464032b0d0Aff9833c446367f54Ew6a27196f8910ec47'

/*###########################################################################################################################
web3
##############################################################################################################################*/
let web3;
async function W3_init() {
    web3 = new Web3(new Web3.providers.HttpProvider(parityHost));
}
async function getAccounts() {
    return await web3.eth.getAccounts();
}






/*###########################################################################################################################
sign transaction
##############################################################################################################################*/
normalize = async (data) => {
    return _.map(data, tx => {
        tx.data.gas = tx.data.gasLimit;
        delete tx.data.gasLimit;

        return tx.data;
    });
}
decrypt = async (toDecrypt, password) => {
    let decipher = crypto.createDecipher('aes-256-ctr', password);
    let dec = decipher.update(toDecrypt, 'hex', 'utf8');
    dec += decipher.final('utf8');

    return dec;
}


function signTransactions(unsignedTxs, wallet, password) {
    return new Promise(async (resolve, reject) => {
        try {

            const decryptedWallet = await decrypt(wallet, password)
            const tx = await MultiBlockchainWallet.signTransaction('ethereum', unsignedTxs[0], decryptedWallet)
            return resolve(tx)
        }
        catch (err) {

            return reject(new Error(err.message));

        }
    });
}


function sign(unsignedTransaction, privateKey) {
    const ethereumTx = new EthereumTx(unsignedTransaction);
    ethereumTx.sign(privateKey);
    const serializedTransaction = ethereumTx.serialize();
    const ethereumTxData = serializedTransaction.toString('hex');

    return /*'0x' + ethereumTxData;*/EthereumUtils.addHexPrefix(ethereumTxData)
}

function getPrivateKey(wallet, password) {
    const privateKey = EthereumWallet.fromV3(wallet, password).getPrivateKeyString();
    return EthereumUtils.toBuffer(privateKey);
}
/*###########################################################################################################################
creat wallet for new profile
##############################################################################################################################*/
function encrypt(toEncrypt, password) {
    let cipher = crypto.createCipher('aes-256-ctr', password);
    let crypted = cipher.update(toEncrypt, 'utf8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
}
function encrypteWallets(wallets, password) {
    const encryptedWallets = wallets.map(wallet => ({
        type: wallet.type,
        blockchainId: wallet.type == 'eos' ? wallet.keyPair.publicKey : wallet.address,
        data: encrypt(wallet.keyPair.privateKey, password)
    }));

    return encryptedWallets;
}
function createWallet() {
    return new Promise((resolve, reject) => {
        try {
            const mnemonic = bip39.generateMnemonic();
            const wallets =  MultiBlockchainWallet.createWalletByMnemonicMulti(mnemonic)
            const seed = bip39.mnemonicToSeed(mnemonic);
            const encryptedSeed = encrypt(mnemonic, '123123123')
            const encryptedWallets = encrypteWallets(wallets, '123123123');

            const walletPayload = { "wallets": encryptedWallets, "seed": encryptedSeed }
            resolve(walletPayload);
        }
        catch (err) {
            const error = new Error(`wallet creation failed : ${err}`)
            reject(console.log(error));
        }
    });
}

async function generateSha256(code = '') {
    let hash = crypto.createHash('sha256');
    hash.update(code);
    return hash.digest('hex');
}

async function sendWallet(wallet, password) {
    const v3Wallet = wallet.toV3String(password, { kdf: 'scrypt', n: 1024 });
    return btoa(v3Wallet);
}




module.exports = {
    signTransactions,
    normalize,
    createWallet,
    sendWallet,
    generateSha256,
    W3_init,
    getAccounts


}

