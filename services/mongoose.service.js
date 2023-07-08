import mongoose from 'mongoose';
import debug from 'debug';
import * as dotenv from "dotenv";
import config from '../config.js';
import findConfig from 'find-config';
import ServerApi from 'mongodb';

const log = debug('app:mongoose-service');

// const credentials = process.env.CERT_WIN;
const credentials = dotenv.config().parsed.CERT_WIN;

console.log("credentials", credentials, );


class MongooseService {
     count = 0;
     mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        serverApi: ServerApi.v1,
        sslKey: credentials,
        sslCert: credentials,
        ssl: true,
        authMechanism: 'MONGODB-X509'
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
        
        // console.log(constring);
        mongoose.set('strictQuery', true);
        mongoose
            .connect(this.connectionString, this.mongooseOptions)
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