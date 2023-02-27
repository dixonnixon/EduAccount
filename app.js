import  express from 'express';
import path  from'path';
// var logger = require('morgan');
// import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit'

// const swaggerUi from 'swagger-ui-express'
// const swaggerFile from './swagger_output.json'
import session from 'express-session';
import sessionFileStore  from 'session-file-store';
import passport from "passport";
import config from './config.js';
import logger from 'morgan';
import helmet from 'helmet';


import indexRoute from './routes/index.js';
import usersRoute from './routes/users.js';

import debug from 'debug';
const log = debug('app');
const FileStore = sessionFileStore(session);


import dotenv from 'dotenv';
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


const app = express();
app.all('*', (req, res, next) => {
    console.log(req.secure, 'https://' + req.hostname + ":" + app.get('port') + req.url);
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


app.use(limiter);
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', indexRoute);
app.use('/users', usersRoute);

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
  
export default app;
