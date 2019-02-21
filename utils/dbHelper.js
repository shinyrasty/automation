const mongodb = require('mongodb').MongoClient;
const mongoUrl = require('./commons').mongoDbUrl;

let clientConnect;
async function getDbClient() {
    
    if (!clientConnect)
    try{
        clientConnect = await mongodb.connect(mongoUrl,{ useNewUrlParser: true });
    }
    catch(e){
        console.log(`cant connect to mongo ${e}`);
        process.exit(1);
    }
    return clientConnect;
}

async function find(dbName, collection, query) {
    const client = await getDbClient();
    console.log(client)
    const db = client.db(dbName);
    const collectionTarget = db.collection(collection);
    const data = collectionTarget.find(query).toArray();
    return data;
}

async function update(dbName, collection, query, target) {
    const client = await getDbClient();
    const db = client.db(dbName);
    const collectionTarget = db.collection(collection);
    return collectionTarget.update(query, target);
}

async function close() {
    await clientConnect.close();
}

module.exports = {
    find,
    update,
    close
};
