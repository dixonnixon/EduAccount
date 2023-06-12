import mongoose from 'mongoose';
import debug from 'debug';
import * as dotenv from "dotenv";
import config from '../config.js';
import findConfig from 'find-config';
import ServerApi from 'mongodb';

const log = debug('app:mongoose-service');

class MongooseService {
     count = 0;
     mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        serverApi: ServerApi.v1
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
        // console.log('Attempting MongoDB connection (will retry if needed)', getDbName() );
        let constring = this.connectionString
            .replace('<pwd>', encodeURIComponent(process.env.DB_PASS ))
            // .replace('<usr>', getUserName())
            .replace('<usr>', process.env.DB_USER)
            // .replace('<serverIp>',  'localhost')
            // .replace('<dbName>', getDbName() );
            .replace('<dbName>', process.env.DB_NAME );
        // console.log(constring);
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