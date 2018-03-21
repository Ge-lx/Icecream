'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _websocket = require('./net/websocket.js');

var _websocket2 = _interopRequireDefault(_websocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONFIG = {
  env: process.env.NODE_ENV || 'development',
  root: __dirname,
  port: 8080,
  vueOptions: {
    rootPath: _path2.default.join(__dirname, 'routes'),
    // vueVersion: '2.5.13',
    head: {
      styles: [{ style: 'static/style.css' }],
      metas: [{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
    }
  }
};

var app = (0, _express2.default)();

app.locals.ENV = CONFIG.env;
app.locals.ENV_DEVELOPMENT = CONFIG.env === 'development';
app.locals.rootPath = process.env.ROOT_PATH;

console.log('Initializing app. Loading componentes...');
_router2.default.init(app, CONFIG);
console.log('Loaded.');

// -------------------------BEGIN WEBSOCKET SETUP-------------
console.log('Starting HTTP Server...');

new Promise(function (resolve, reject) {
  var server = _http2.default.createServer(app);

  _websocket2.default.startServer(server, CONFIG); // Starting Websocket server

  server.listen(CONFIG.port);
  server.on('error', reject);
  server.on('listening', resolve);
}).then(function () {
  console.log('Worker ' + process.pid + ' running a ' + CONFIG.env + ' server. Listening on ' + CONFIG.port);
}).catch(function (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.err('Port ' + CONFIG.bind_port + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.err('Port ' + CONFIG.bind_port + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
});
//# sourceMappingURL=main.js.map
