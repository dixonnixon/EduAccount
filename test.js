import { MongoClient, ServerApiVersion  } from  'mongodb';
import config from '../config.js';


const conf = dotenv.config()


const credentials = conf.parsed.CERT_WIN;


// Connection URL
// const url = 'mongodb://Test:' + encodeURIComponent('AppGu@rd') + '@localhost:27017';
const url = config.mongoUrl;
const client = new MongoClient(url, {
  sslKey: credentials,
  sslCert: credentials,
  serverApi: ServerApiVersion.v1
});

// Database Name
const dbName = 'monitoring_test';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('documents');

  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());