import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient

let database
const initDatabase = (callback) => {
    if (database) {
        console.log('Database has been successfully connected to!')
        return callback(null, database)
    }

    MongoClient.connect(process.env.MONGO_URL).then((client) => {
        database = client.db(process.env.DB_NAME)
        return callback(null, database)
    }).catch((error) => {
        console.error('No database was found. Initiate Call!', error);
        callback(error)
    }) 
}
const getDatabase = () => {
    if (!database) {
        throw new Error("Connect to database, first.");
    }
    return database
}
export default { initDatabase, getDatabase }