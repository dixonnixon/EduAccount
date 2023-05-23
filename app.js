import  express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv';
// const swaggerUi from 'swagger-ui-express'
// const swaggerFile from './swagger_output.json'
import session from 'express-session';
import sessionFileStore  from 'session-file-store';
import passport from "passport";
import logger from 'morgan';
import helmet from 'helmet';
import * as expressWinston from 'express-winston';

import * as winston from 'winston';






import indexRoute from './routes/index.js';
import usersRoute from './routes/users.js';
import addressesRoute from './routes/addresses.js';
import educatorsRoute from './routes/educators.js';
import itemsRoute from './routes/items.js';
import categoriesRoute from './routes/categories.js';
import workplacesRoute from './routes/workplaces.js';
import propsRoute from './routes/props.js';

import debug from 'debug';
const log = debug('app');
const FileStore = sessionFileStore(session);

const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
    if(typeof global.it === 'function') {
        loggerOptions.level = 'http'; //4 non-debug tests
    }
}





const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (request, response, next, options) =>
		response.status(options.statusCode).send(options.message),
});


function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  }

const port = normalizePort(process.env.PORT || '3000' );





const app = express();
app.set('port', port);

app.use(expressWinston.logger(loggerOptions));

app.all('*', (req, res, next) => {
    // (req.secure, 'https://' + req.hostname + ":" + app.get('port') + req.url);
    return next();
    // if(req.secure) {
    //   return next();
    // }
    // else {
    //   console.log("redirected to: ", 
    //   'https://' + req.hostname + ":" + app.get('port') + req.url
    //   );
    //   res.redirect(307, 'https://' + req.hostname + ":" + app.get('port') + req.url);
    // }
});

app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));
  
app.disable('x-powered-by')
app.use(express.json());
app.use(cookieParser());


app.use(limiter);
app.use(helmet());
app.use(express.static('public'));


app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use('/addresses', addressesRoute);
app.use('/educators', educatorsRoute);



app.use('/items', itemsRoute);
app.use('/workplaces', workplacesRoute);

//EAV
app.use('/properties', propsRoute);
app.use('/categories', categoriesRoute);
// app.use('/values', valuesRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });


  
  // error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    log("ENV", req.app.get('env'));
    // render the error page
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
      });
});

console.log(`ENV: ${app.get('env')}`);
if(app.get('env') !== 'test') app.use(logger('dev'));

  
export default app;
