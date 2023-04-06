import mongoose from 'mongoose';
import debug from 'debug';
import * as dotenv from "dotenv";
import config from '../config.js';
import findConfig from 'find-config';




function getDbName() {
    dotenv.config({ path: findConfig('.env') });
    let DbName;
    console.log('*********************************************************\r\n\r\n', process.env.NODE_ENV, process.env.DB_NAME);

    if (process.env.NODE_ENV ==='dev') {
        DbName = `${process.env.DB_NAME}`;
    }
    if (process.env.NODE_ENV ==='test') {
        DbName = `${process.env.DB_NAME}_test`;
    }
    if (process.env.NODE_ENV ==='prod') {
        DbName = `${process.env.DB_NAME}`;
    }
    console.log("DbName", DbName);
    return DbName;
}

function getUserName() {
    let userName;
    console.log('getUserName*********************************************************\r\n\r\n', process.env.DB_NAME, 
     process.env.NODE_ENV);

    if (process.env.NODE_ENV ==='dev'){
        userName = 'Admin';
    }
    if (process.env.NODE_ENV ==='test'){
        userName = 'Test';
    }
    if (process.env.NODE_ENV ==='prod'){
        userName = 'Admin';
    }
    console.log("userName=", userName);
    return userName;
}

const log = debug('app:mongoose-service');

class MongooseService {
     count = 0;
     mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
    };

    constructor(dbName) {
        this.config = findConfig('.env');
        this.connectionString = config.mongoUrl;
        this.connectWithRetry(dbName);

    }

    getMongoose() {
        return mongoose;
    }

    //retry connectivity recurse timeout method
    connectWithRetry = ( ) => {      
        const config = dotenv.config({ path: this.config });
        console.log('Attempting MongoDB connection (will retry if needed)', getDbName() );
        let constring = this.connectionString
            .replace('<pwd>', encodeURIComponent(process.env.DB_PASS ))
            .replace('<usr>', getUserName())
            // .replace('<serverIp>',  'localhost')
            .replace('<dbName>', getDbName() );
        console.log(constring);
        mongoose.set('strictQuery', true);
        mongoose
            .connect(constring, this.mongooseOptions)
            .then((res) => {
                log(res, 'MongoDB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                console.log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default new MongooseService('');