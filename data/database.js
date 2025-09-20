const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv')
dotenv.config()

let database
const initDatabase = (callback) => {
    if (database) {
        console.log('Database has been successfully connected to!')
        return callback(null, database)
    }

    MongoClient.connect(process.env.MONGO_URL).then((client) => {
        database = client.db(process.env.DB_NAME)
        return callback(null, database)
    }).catch((err) => {
        console.error('No database was found. Initiate Call!', err);
        callback(err)
    }) 
}
const getDatabase = () => {
    if (!database) {
        throw new Error("Connect to database, first.");
    }
    return database
}
module.exports = { initDatabase, getDatabase }