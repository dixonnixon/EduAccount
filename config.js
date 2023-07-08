const NODE_ENV = process.env.NODE_ENV;
const isDev = NODE_ENV === "development";
const isProd = NODE_ENV === "production";


export default {
    keys: {
        isDev,
        isProd
    },
    'secretKey': '12345-67890-09876-54321',
    // 'mongoUrl': 'mongodb://<usr>:<pwd>@localhost:27017/<dbName>?authSource=admin',
    'mongoUrl': 'mongodb+srv://tuts.2lewc.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority'
};