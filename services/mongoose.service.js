import mongoose from 'mongoose';
import debug from 'debug';
import * as dotenv from "dotenv";
import config from '../config.js';
import findConfig from 'find-config';



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
    connectWithRetry = (dbName ) => {      
        const config = dotenv.config({ path: this.config });
        log('Attempting MongoDB connection (will retry if needed)');
        let constring = this.connectionString
            .replace('<pwd>', encodeURIComponent(process.env.DB_PASS ))
            // .replace('<username>',  process.env.DB_USER)
            // .replace('<serverIp>',  'localhost')
            // .replace('<database>',   dbName || process.env.DB_NAME );
        mongoose.set('strictQuery', true);
        mongoose
            .connect(constring, this.mongooseOptions)
            .then((res) => {
                log(res, 'MongoDB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default new MongooseService('');