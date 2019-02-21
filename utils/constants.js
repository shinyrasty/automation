const db = require('./dbHelper');
const fs = require('fs');

let contracts = {
    smartToken: { filename: 'SmartToken' },
    bancorConverterV10: { filename: 'BancorConverterV10' },
    bancorConverterV11: { filename: 'BancorConverterV11' }
};

async function pullConstants() {
    const constants = {
        BNT: null,
        ETH: null,
        STX: null,
        KIN: null,
        BAT: null
    };

    try {
        mazingerid = await db.find('accounts', 'profiles', { "displayName": "omry" });
        process.env['PROFILE_ID'] = mazingerid[0]._id;
        process.env['ACCOUNT_ID'] = mazingerid[0].accountId;
        const queryRes = await db.find('currencies', 'currencies',{code:{$in:['BNT','ETH','STX','KIN','BAT']}} );
        constants.BAT = String(queryRes[0]._id);
        constants.BNT = String(queryRes[1]._id);
        constants.ETH = String(queryRes[2]._id);
        constants.KIN = String(queryRes[3]._id);
        constants.STX = String(queryRes[4]._id);


        await db.close();
        return constants;
    } catch (e) {
        const dbError = new Error(`db querry failed : ${e}`)
        await db.close();
        return dbError
    }

}
async function loadContractFiles() {
    let promises = [];

    // load contract abi/bin data
    promises.push(Promise.map(Object.keys(contracts), (contractName) => {
        let abiFilepath = path.resolve(contractsPath, contracts[contractName].filename + '.abi');
        let binFilepath = path.resolve(contractsPath, contracts[contractName].filename + '.bin');
        return Promise.all([
            fs.readFileAsync(abiFilepath, 'utf-8')
                .then((data) => {
                    contracts[contractName].abi = JSON.parse(data);
                }),
            fs.readFileAsync(binFilepath, 'utf-8')
                .then((data) => {
                    contracts[contractName].bin = '0x' + data;
                })
        ]);
    }));

    await Promise.all(promises);
}
module.exports = {
    pullConstants,
    loadContractFiles
};
// pullConstants()
