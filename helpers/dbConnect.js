
import mongoose from 'mongoose';
const DB_uri    = `mongodb://Test:${encodeURIComponent('AppGu@rd')}@localhost/monitoring_test?auth_source=admin`;

export function dbConnect() {
    mongoose.connect(DB_uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false})
    return mongoose.connection;
  }
  
  export function dbClose() {
    return mongoose.disconnect();
  }

