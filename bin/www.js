#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import debug from 'debug';
import fs from 'fs';
import http from 'http';
// import https from 'https';


const log = debug('app:www');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
// app.set('port',  443);

/**
 * Create HTTP server.
 */

// var options = {
//   // key: fs.readFileSync(__dirname + '/cert.key'),
//   key: fs.readFileSync(__dirname + '/key.pem'),
//   cert: fs.readFileSync(__dirname + '/cert.pem')
// };



// var server = https.createServer(options, app);
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(app.get('port'), () => {
  console.log('Server listening on port ',app.get('port'));
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

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

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  // console.log('Listening on ' + bind);
  debug('Listening on ' + bind);
}
